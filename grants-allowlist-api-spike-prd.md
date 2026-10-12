Background
As part of the Grasslands integration work, we’ve been looking into the existing allow-list functionality within the Grants service and how this could potentially be used by SFD.

At the moment, SFD displays static grant cards. The proposed approach is for SFD to use the existing Grants allow-list functionality to determine which grants should be shown to a user.

We’ve reviewed the existing API documentation and discussed the initial findings and questions with the Grants team. There are now a few SFD-specific points that need technical input before we can confirm the proposed approach.

The full investigation, findings and proposed future-state flow are captured on the Confluence page here:
Grasslands Allow-List Investigation


Technical Review
The purpose of this technical review is to validate the proposed approach from an SFD perspective and work through the remaining technical considerations, including:

The proposed use of CRN only rather than CRN and SBI and whether this has any implications for SFD

When/how the Grants allow-list API should be called from SFD

How we should handle API failures

How we should handle a successful response where no grants are returned

How the response should be used to determine which grant cards are displayed, including where multiple grants are returned

Any other technical dependencies or considerations that we need to take into account

Outcome
The outcome of this review should give us enough information to validate or amend the proposed future-state flow, close out any remaining questions with the Grants team and identify Jira tickets required for implementation

Timebox:

Acceptance Criteria
Technical details reviewed and questions listed in the ticket have been discussed/answered.

Ticket created with implementation details and draft acceptance criteria
