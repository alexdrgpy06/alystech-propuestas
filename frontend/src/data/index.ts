import type { ProposalContent } from '../types/proposal';
import { PROPOSAL_ID, EXCHANGE_RATE, DEVICE_COUNT } from './constants';
import { hero } from './hero';
import { about } from './about';
import { conditions } from './conditions';
import { overview } from './overview';
import { glanceCards } from './glance';
import { mdm } from './groups/mdm';
import { srv } from './groups/srv';
import { net } from './groups/net';
import { aud } from './groups/aud';
import { sup } from './groups/sup';
import { onboarding } from './onboarding';
import { nextSteps } from './nextSteps';
import { terms } from './terms';
import { tco } from './tco';
import { canvas } from './canvas';
import { modals } from './modals';

export const proposalContent: ProposalContent = {
  proposalId: PROPOSAL_ID,
  exchangeRate: EXCHANGE_RATE,
  deviceCount: DEVICE_COUNT,
  hero,
  about,
  conditions,
  overview,
  glanceCards,
  groups: [mdm, srv, net, aud, sup],
  onboarding,
  nextSteps,
  terms,
  canvas,
  tco,
  modals,
};
