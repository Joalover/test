export type FailureIdea = {
  id: string;
  text: string;
  checked: boolean;
};

export type PreventiveAction = {
  id: string;
  risk: string;
  action: string;
  owner: string;
  due: string;
  status: string;
};

export type RootCause = {
  riskIndex: number;
  whys: string[];
};

export type WorksheetData = {
  header: {
    projectTitle: string;
    dateTime: string;
    facilitator: string;
    participants: string;
  };
  successSnapshot: string[];
  catastropheHeadline: string;
  brainstormFailures: FailureIdea[];
  topRisks: string[];
  rootCauses: RootCause[];
  preventiveActions: PreventiveAction[];
  checkpoints: { metric: string; reporting: string }[];
  commitments: {
    nextReviewDate: string;
    trackerLink: string;
    facilitatorSignOff: string;
  };
};
