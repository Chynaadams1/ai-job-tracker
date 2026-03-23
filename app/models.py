from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    status = Column(String, default="applied")
    job_url = Column(String, nullable=True)
    salary = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    resume_submitted = Column(String, nullable=True)
    date_applied = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())