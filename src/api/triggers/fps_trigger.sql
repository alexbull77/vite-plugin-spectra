CREATE OR REPLACE FUNCTION cleanup_old_fps_logs()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete records older than the most recent 5 for the same session_id and microfrontend_id
  DELETE FROM fps_logs
  WHERE id IN (
    SELECT id
    FROM fps_logs
    WHERE session_id = NEW.session_id
    ORDER BY recorded_at DESC  -- Sort by most recent first
    OFFSET 5 -- Keep the latest 5, delete the rest
  );
  
  -- Return the inserted row
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
