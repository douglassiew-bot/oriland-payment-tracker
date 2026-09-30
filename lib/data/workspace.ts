import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Workspace, WorkspaceInvitation, WorkspaceMember } from "@/lib/types";

type MembershipRow = {
  workspace_id: string;
  role: "owner" | "member";
  workspaces: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

export async function getCurrentWorkspace(): Promise<Workspace | null> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  await supabase.rpc("claim_workspace_access");
  const { data, error } = await supabase
    .from("workspace_members")
    .select("workspace_id,role,workspaces(name,slug)")
    .eq("user_id", userData.user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as MembershipRow;
  const related = Array.isArray(row.workspaces) ? row.workspaces[0] : row.workspaces;
  if (!related) return null;
  return { id: row.workspace_id, name: related.name, slug: related.slug, role: row.role };
}

export async function requireWorkspace(): Promise<Workspace> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  const workspace = await getCurrentWorkspace();
  if (!workspace) redirect("/no-access");
  return workspace;
}

export async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  return data.user.id;
}

export async function getViewer() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const workspace = data.user ? await getCurrentWorkspace() : null;
  return { email: data.user?.email ?? null, workspace };
}

export async function getTeam() {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const [{ data: members, error: memberError }, { data: invitations, error: invitationError }] = await Promise.all([
    supabase.from("workspace_members").select("user_id,email,role,created_at").eq("workspace_id", workspace.id).order("created_at"),
    supabase.from("workspace_invitations").select("id,email,role,status,created_at").eq("workspace_id", workspace.id).order("created_at", { ascending: false }),
  ]);
  if (memberError) throw memberError;
  if (invitationError) throw invitationError;
  return { workspace, members: (members ?? []) as WorkspaceMember[], invitations: (invitations ?? []) as WorkspaceInvitation[] };
}

export async function inviteMember(email: string) {
  const workspace = await requireWorkspace();
  if (workspace.role !== "owner") throw new Error("Only the workspace owner can invite members.");
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("You must be signed in.");
  const normalizedEmail = email.trim().toLowerCase();
  const { error } = await supabase.from("workspace_invitations").insert({
    workspace_id: workspace.id,
    email: normalizedEmail,
    role: "member",
    invited_by: userData.user.id,
  });
  if (error) throw error;
}

export async function revokeInvitation(id: string) {
  const workspace = await requireWorkspace();
  if (workspace.role !== "owner") throw new Error("Only the workspace owner can revoke invitations.");
  const supabase = await createClient();
  const { error } = await supabase.from("workspace_invitations").update({ status: "revoked" }).eq("id", id).eq("workspace_id", workspace.id);
  if (error) throw error;
}
