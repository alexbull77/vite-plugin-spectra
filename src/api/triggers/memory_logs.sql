CREATE OR REPLACE FUNCTION maintain_memory_log_limit()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM memory_logs
    WHERE id IN (
        SELECT id
        FROM memory_logs
        WHERE session_id = NEW.session_id
        ORDER BY recorded_at DESC
        OFFSET 10
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
