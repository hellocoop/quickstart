# CLAUDE.md

Developer quickstart/onboarding app — guides new developers through their first Hellō integration.

## Shared Documentation

- For shared Hellō development documentation, see `../playbook/operations/`
- For AWS SSO and profile setup, see `../playbook/operations/aws-sso.md`
- For repository descriptions, see `../playbook/operations/repositories.md`

## AWS

NEVER run `aws sso login`. To verify an AWS session is active, use `aws sts get-caller-identity --profile <profile-name>` and confirm the account ID matches the expected value.
