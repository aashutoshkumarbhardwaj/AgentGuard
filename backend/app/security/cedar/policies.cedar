@id("allow-calendar-read")
permit (
    principal,
    action == Action::"calendar.read",
    resource
);

@id("allow-email-read")
permit (
    principal,
    action == Action::"email.read",
    resource
);

@id("allow-file-read")
permit (
    principal,
    action == Action::"file.read",
    resource
);

@id("allow-email-send")
permit (
    principal,
    action == Action::"email.send",
    resource
);

@id("allow-file-modify-development")
permit (
    principal,
    action == Action::"file.modify",
    resource
)
when {
    context.environment == "development"
};

@id("deny-file-delete")
forbid (
    principal,
    action == Action::"file.delete",
    resource
);

@id("deny-credential-access")
forbid (
    principal,
    action == Action::"credential.read",
    resource
);

@id("deny-external-sensitive-transfer")
forbid (
    principal,
    action == Action::"data.export",
    resource
)
when {
    context.destination == "external"
};
