from app.tools.calendar import read_calendar
from app.tools.email import send_email
from app.tools.files import (
    read_file,
    modify_file,
    delete_files
)


TOOLS = {
    "calendar.read": read_calendar,
    "email.send": send_email,
    "file.read": read_file,
    "file.modify": modify_file,
    "file.delete": delete_files,
}