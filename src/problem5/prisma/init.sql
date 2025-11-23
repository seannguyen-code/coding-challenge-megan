-- Create resources table
CREATE TABLE IF NOT EXISTS resources
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    type       VARCHAR(100) NOT NULL,
    status     VARCHAR(50)  DEFAULT 'active',
    metadata   JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on status for better query performance
CREATE INDEX idx_resources_status ON resources (status);
CREATE INDEX idx_resources_type ON resources (type);

-- Insert seed data
INSERT INTO resources (name, type, status, metadata) VALUES
    ('Server Alpha', 'compute', 'active', '{"region": "us-east-1", "cpu": 4, "ram": 16}'),
    ('Database Primary', 'database', 'active', '{"region": "us-west-2", "size": "large", "replicas": 2}'),
    ('Storage Bucket', 'storage', 'active', '{"region": "eu-central-1", "capacity": "500GB", "encrypted": true}'),
    ('Load Balancer', 'network', 'inactive', '{"region": "ap-southeast-1", "protocol": "HTTPS"}'),
    ('API Gateway', 'network', 'active', '{"region": "us-east-1", "endpoints": 25, "rate_limit": 1000}');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE
    ON resources
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
