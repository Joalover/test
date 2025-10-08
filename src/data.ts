import { WorksheetData } from './types';
import { nanoid } from './utils';

export const defaultWorksheet = (): WorksheetData => ({
  header: {
    projectTitle: '',
    dateTime: '',
    facilitator: '',
    participants: '',
  },
  successSnapshot: ['', '', ''],
  catastropheHeadline: '',
  brainstormFailures: [
    { id: nanoid(), text: '', checked: false },
    { id: nanoid(), text: '', checked: false },
    { id: nanoid(), text: '', checked: false },
  ],
  topRisks: ['', '', '', '', ''],
  rootCauses: [
    { riskIndex: 0, whys: ['', '', '', '', ''] },
    { riskIndex: 1, whys: ['', '', '', '', ''] },
    { riskIndex: 2, whys: ['', '', '', '', ''] },
  ],
  preventiveActions: [
    {
      id: nanoid(),
      risk: '',
      action: '',
      owner: '',
      due: '',
      status: '',
    },
  ],
  checkpoints: [
    { metric: '', reporting: '' },
    { metric: '', reporting: '' },
    { metric: '', reporting: '' },
  ],
  commitments: {
    nextReviewDate: '',
    trackerLink: '',
    facilitatorSignOff: '',
  },
});
