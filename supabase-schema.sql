-- ============================================
-- LetMeCheck Supabase Database Schema
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    graduation_level TEXT NOT NULL CHECK (graduation_level IN ('Undergraduate', 'Graduate', 'Postgraduate')),
    year_of_study TEXT NOT NULL,
    target_job_role TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESUMES TABLE
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    target_role TEXT NOT NULL,
    analysis_score INTEGER CHECK (analysis_score >= 0 AND analysis_score <= 100),
    analysis_results JSONB DEFAULT '{}',
    extracted_text TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SKILL GAPS TABLE
CREATE TABLE skill_gaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    target_role TEXT NOT NULL,
    missing_skills JSONB DEFAULT '[]',
    present_skills JSONB DEFAULT '[]',
    skill_coverage_percent INTEGER DEFAULT 0,
    analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COURSES TABLE
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    skills_covered JSONB DEFAULT '[]',
    duration TEXT,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    url TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER COURSES TABLE
CREATE TABLE user_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'accessed', 'in_progress', 'completed')),
    accessed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- 6. CERTIFICATES TABLE
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_course_id UUID REFERENCES user_courses(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    extracted_text TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    rejection_reason TEXT,
    badge_id UUID,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BADGES TABLE
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    certificate_id UUID REFERENCES certificates(id) ON DELETE SET NULL,
    badge_name TEXT NOT NULL,
    course_name TEXT NOT NULL,
    verification_id TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE certificates ADD CONSTRAINT fk_certificate_badge FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE SET NULL;

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own skill gaps" ON skill_gaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skill gaps" ON skill_gaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Courses are public" ON courses FOR SELECT USING (true);
CREATE POLICY "Users can view own user courses" ON user_courses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user courses" ON user_courses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user courses" ON user_courses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own certificates" ON certificates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own certificates" ON certificates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own badges" ON badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, graduation_level, year_of_study, target_job_role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.email,
        NEW.raw_user_meta_data->>'graduation_level',
        NEW.raw_user_meta_data->>'year_of_study',
        NEW.raw_user_meta_data->>'target_job_role'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- SEED DATA: COURSES
INSERT INTO courses (title, provider, skills_covered, duration, difficulty, url, category) VALUES
('Full-Stack Web Development Bootcamp', 'Udemy', '["React.js", "Node.js", "Express", "MongoDB", "JavaScript"]', '12 weeks', 'Intermediate', 'https://udemy.com/course/full-stack-web-dev', 'Technical'),
('Data Structures & Algorithms Masterclass', 'Coursera', '["DSA", "Java", "Python", "Problem Solving", "Algorithms"]', '8 weeks', 'Intermediate', 'https://coursera.org/dsa-masterclass', 'Technical'),
('Machine Learning A-Z', 'Udemy', '["Machine Learning", "Python", "TensorFlow", "Scikit-learn", "Data Analysis"]', '10 weeks', 'Beginner', 'https://udemy.com/course/machine-learning-a-z', 'Technical'),
('AWS Certified Solutions Architect', 'Udemy', '["AWS", "Cloud Computing", "Architecture", "DevOps", "Infrastructure"]', '6 weeks', 'Advanced', 'https://udemy.com/course/aws-certified-solutions-architect', 'Technical'),
('React - The Complete Guide', 'Udemy', '["React.js", "Redux", "Hooks", "JavaScript", "Frontend"]', '8 weeks', 'Intermediate', 'https://udemy.com/course/react-the-complete-guide', 'Technical'),
('Python for Data Science', 'Coursera', '["Python", "Pandas", "NumPy", "Data Analysis", "Visualization"]', '4 weeks', 'Beginner', 'https://coursera.org/python-data-science', 'Technical'),
('UI/UX Design Specialization', 'Coursera', '["Figma", "User Research", "Prototyping", "Design Systems", "Wireframing"]', '6 weeks', 'Beginner', 'https://coursera.org/ui-ux-design', 'Design'),
('DevOps Engineering Fundamentals', 'edX', '["Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform"]', '10 weeks', 'Intermediate', 'https://edx.org/devops-fundamentals', 'Technical'),
('Cybersecurity Fundamentals', 'Coursera', '["Network Security", "Ethical Hacking", "Risk Assessment", "Cryptography", "Compliance"]', '8 weeks', 'Beginner', 'https://coursera.org/cybersecurity-fundamentals', 'Technical'),
('Blockchain Development', 'Udemy', '["Solidity", "Ethereum", "Smart Contracts", "Web3.js", "DeFi"]', '6 weeks', 'Advanced', 'https://udemy.com/course/blockchain-development', 'Technical'),
('Agile Project Management', 'Coursera', '["Agile", "Scrum", "Jira", "Project Management", "Team Leadership"]', '4 weeks', 'Beginner', 'https://coursera.org/agile-project-management', 'Management'),
('SQL & Database Design', 'Udemy', '["SQL", "MySQL", "PostgreSQL", "Database Design", "Normalization"]', '5 weeks', 'Beginner', 'https://udemy.com/course/sql-database-design', 'Technical'),
('Mobile App Development with Flutter', 'Udemy', '["Flutter", "Dart", "Mobile Development", "iOS", "Android"]', '8 weeks', 'Intermediate', 'https://udemy.com/course/flutter-development', 'Technical'),
('Natural Language Processing', 'Coursera', '["NLP", "Python", "TensorFlow", "Text Processing", "Transformers"]', '6 weeks', 'Advanced', 'https://coursera.org/nlp-specialization', 'Technical'),
('Computer Vision Basics', 'Udemy', '["Computer Vision", "OpenCV", "Python", "Image Processing", "Deep Learning"]', '5 weeks', 'Intermediate', 'https://udemy.com/course/computer-vision-basics', 'Technical'),
('System Design Interview Prep', 'Udemy', '["System Design", "Scalability", "Microservices", "Distributed Systems", "Architecture"]', '4 weeks', 'Advanced', 'https://udemy.com/course/system-design-interview', 'Technical'),
('Git & GitHub Masterclass', 'Udemy', '["Git", "GitHub", "Version Control", "Collaboration", "CI/CD"]', '2 weeks', 'Beginner', 'https://udemy.com/course/git-github-masterclass', 'Technical'),
('Docker & Kubernetes Complete', 'Udemy', '["Docker", "Kubernetes", "Containerization", "Orchestration", "DevOps"]', '6 weeks', 'Intermediate', 'https://udemy.com/course/docker-kubernetes-complete', 'Technical'),
('Business Analysis Fundamentals', 'Coursera', '["Business Analysis", "Requirements Gathering", "Stakeholder Management", "Documentation", "Process Modeling"]', '5 weeks', 'Beginner', 'https://coursera.org/business-analysis', 'Management'),
('Quality Assurance Testing', 'Udemy', '["Selenium", "Manual Testing", "Automation", "Test Cases", "Bug Tracking"]', '4 weeks', 'Beginner', 'https://udemy.com/course/qa-testing', 'Technical'),
('Cloud Computing with Azure', 'Microsoft Learn', '["Azure", "Cloud Services", "Virtual Machines", "Storage", "Networking"]', '6 weeks', 'Intermediate', 'https://learn.microsoft.com/azure', 'Technical'),
('Embedded Systems Programming', 'Coursera', '["C", "Microcontrollers", "Embedded C", "RTOS", "Hardware Interfacing"]', '8 weeks', 'Advanced', 'https://coursera.org/embedded-systems', 'Technical'),
('IoT Development', 'Udemy', '["IoT", "Arduino", "Raspberry Pi", "Sensors", "MQTT"]', '5 weeks', 'Intermediate', 'https://udemy.com/course/iot-development', 'Technical'),
('Technical Writing', 'Coursera', '["Technical Writing", "Documentation", "API Documentation", "Markdown", "Communication"]', '4 weeks', 'Beginner', 'https://coursera.org/technical-writing', 'Communication'),
('Network Engineering', 'Cisco Networking Academy', '["Networking", "CCNA", "Routing", "Switching", "Security"]', '10 weeks', 'Intermediate', 'https://netacad.com/ccna', 'Technical'),
('Game Development with Unity', 'Udemy', '["Unity", "C#", "Game Design", "3D Modeling", "Physics"]', '8 weeks', 'Beginner', 'https://udemy.com/course/unity-game-development', 'Technical'),
('Product Management 101', 'Coursera', '["Product Management", "Roadmapping", "User Stories", "Metrics", "Strategy"]', '5 weeks', 'Beginner', 'https://coursera.org/product-management', 'Management'),
('Soft Skills for Tech Professionals', 'LinkedIn Learning', '["Communication", "Teamwork", "Problem Solving", "Time Management", "Leadership"]', '3 weeks', 'Beginner', 'https://linkedin.com/learning/soft-skills-tech', 'Soft Skills'),
('API Development with Node.js', 'Udemy', '["Node.js", "Express", "REST API", "GraphQL", "Authentication"]', '5 weeks', 'Intermediate', 'https://udemy.com/course/api-development-nodejs', 'Technical'),
('Data Engineering with Apache Spark', 'Coursera', '["Apache Spark", "Big Data", "ETL", "Hadoop", "Python"]', '6 weeks', 'Advanced', 'https://coursera.org/data-engineering-spark', 'Technical');
