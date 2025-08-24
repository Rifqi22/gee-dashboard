import re
from fastapi import HTTPException

# Ensure date strings follow YYYY-MM format
def validate_date_format(date_str: str):
    if not re.match(r"^\d{4}-\d{2}$", date_str):
        raise HTTPException(status_code=400, detail="Dates must be in YYYY-MM format")
