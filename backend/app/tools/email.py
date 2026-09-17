def send_email(recipient: str, subject: str, body: str):
    print(f"[TOOL EXECUTED] Sending email to {recipient}")

    return {
        "success": True,
        "message": f"Email sent to {recipient}"
    }