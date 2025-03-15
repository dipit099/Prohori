-- First, insert divisions
INSERT INTO divisions (name) VALUES
    ('Dhaka'),
    ('Chittagong'),
    ('Rajshahi'),
    ('Khulna'),
    ('Barisal'),
    ('Sylhet'),
    ('Rangpur'),
    ('Mymensingh');

-- Then, insert districts for each division
WITH division_districts AS (
    SELECT d.id as division_id, d.name as division_name, unnest(ARRAY[
        CASE d.name 
            WHEN 'Dhaka' THEN ARRAY['Dhaka', 'Gazipur', 'Narayanganj', 'Munshiganj', 'Manikganj', 'Narsingdi', 'Tangail', 'Kishoreganj', 'Madaripur', 'Shariatpur', 'Gopalganj', 'Faridpur', 'Rajbari']
            WHEN 'Chittagong' THEN ARRAY['Chittagong', 'Cox''s Bazar', 'Rangamati', 'Bandarban', 'Khagrachari', 'Feni', 'Lakshmipur', 'Noakhali', 'Chandpur', 'Comilla', 'Brahmanbaria']
            WHEN 'Rajshahi' THEN ARRAY['Rajshahi', 'Chapainawabganj', 'Naogaon', 'Natore', 'Pabna', 'Sirajganj', 'Bogra', 'Joypurhat']
            WHEN 'Khulna' THEN ARRAY['Khulna', 'Bagerhat', 'Satkhira', 'Jessore', 'Magura', 'Jhenaidah', 'Narail', 'Kushtia', 'Chuadanga', 'Meherpur']
            WHEN 'Barisal' THEN ARRAY['Barisal', 'Bhola', 'Patuakhali', 'Pirojpur', 'Jhalokati', 'Barguna']
            WHEN 'Sylhet' THEN ARRAY['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj']
            WHEN 'Rangpur' THEN ARRAY['Rangpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Dinajpur', 'Thakurgaon', 'Panchagarh']
            WHEN 'Mymensingh' THEN ARRAY['Mymensingh', 'Jamalpur', 'Sherpur', 'Netrokona']
        END
    ]) as district_name
    FROM divisions d
)
INSERT INTO districts (division_id, name)
SELECT division_id, district_name
FROM division_districts
WHERE district_name IS NOT NULL;