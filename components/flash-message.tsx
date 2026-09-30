export function FlashMessage({ success, error }: { success?: string; error?: string }) {
  if (!success && !error) return null;
  return <div className={`alert ${error ? "alert-danger" : "alert-success"}`} role="status"><span className="alert-icon">{error ? "!" : "✓"}</span><div><strong>{error ? "Action required" : "Done"}</strong><p>{error ?? success}</p></div></div>;
}
