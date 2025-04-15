CREATE OR REPLACE FUNCTION maintain_memory_log_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete older rows for the same session_id if there are more than 10 rows in the table
    DELETE FROM memory_logs
    WHERE id IN (
        SELECT id
        FROM memory_logs
        WHERE session_id = NEW.session_id
        ORDER BY recorded_at DESC
        OFFSET 10
    );
    
    -- Return the new inserted row to continue the process
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
