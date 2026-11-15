export interface SourceRecord {
  id: string;
  title: string;
  value: string;
  proposed: string;
  meaning: string;
}
export interface DocumentRecord {
  id: string;
  title: string;
  audience: string;
  owner: string;
  purpose: string;
  fields: { label: string; source: string }[];
}
export interface Scenario {
  id: string;
  title: string;
  intro: string;
  question: string;
  sources: SourceRecord[];
  documents: DocumentRecord[];
  aiRequest: string;
  aiBrief: string;
}
export type Method = 'cards' | 'map' | 'comparison' | 'timeline';
export interface Proposal {
  number: number;
  title: string;
  example: string;
  method: Method;
  methodName: string;
  change: string;
  instruction: string;
  lesson: string;
  strength: string;
  limitation: string;
  verdict: string;
}
export const scenarios: Record<string, Scenario> = {
  training: {
    id: 'training', title: 'A training day',
    intro: 'You are arranging a half-day course. Participants need an invitation, the trainer needs a brief, and everyone uses the course handout. The room, time and topic are maintained as shared information.',
    question: 'The room changes. Which materials need attention, and who should update them?',
    sources: [
      { id: 'room', title: 'Room booking', value: 'Room 204', proposed: 'Room 310', meaning: 'The room reserved for this course.' },
      { id: 'time', title: 'Session time', value: '09:00–12:00', proposed: '10:00–13:00', meaning: 'The start and finish time used in the invitation and trainer brief.' },
      { id: 'topic', title: 'Course topic', value: 'Planning a small project', proposed: 'Reviewing a project plan', meaning: 'The subject taught in the course and covered by its handout.' },
    ],
    documents: [
      { id: 'invitation', title: 'Participant invitation', audience: 'Participants', owner: 'Course coordinator', purpose: 'Tell participants where to go and when to arrive.', fields: [{label:'Room',source:'room'},{label:'Time',source:'time'}] },
      { id: 'trainer', title: 'Trainer brief', audience: 'Trainers', owner: 'Lead trainer', purpose: 'Prepare the session and arrive at the right place.', fields: [{label:'Room',source:'room'},{label:'Time',source:'time'},{label:'Topic',source:'topic'}] },
      { id: 'handout', title: 'Course handout', audience: 'Everyone', owner: 'Course author', purpose: 'Provide explanations and exercises for the session.', fields: [{label:'Topic',source:'topic'}] },
    ],
    aiRequest: 'The room has changed to Room 310. Find the materials that use the room booking, identify their owners, and draft the updates with references to the source.',
    aiBrief: 'The participant invitation and trainer brief use the room booking. Ask the course coordinator and lead trainer to review their updates to Room 310. The handout draws on the course topic, so the recorded links give no room-related update for it.',
  },
  product: {
    id: 'product', title: 'A product launch',
    intro: 'You are preparing the launch of the Harbor desk lamp. The web page and sales sheet use the same product facts. The support team has a guide with the contact address for customer questions.',
    question: 'The first delivery date moves from 15 June to 22 June. Where does the old date appear?',
    sources: [
      { id: 'date', title: 'First delivery date', value: '15 June', proposed: '22 June', meaning: 'The expected first delivery date communicated to customers.' },
      { id: 'price', title: 'Unit price', value: '€120', proposed: '€135', meaning: 'The price used in the two sales publications.' },
      { id: 'support', title: 'Support address', value: 'support@harbor.example', proposed: 'care@harbor.example', meaning: 'The email address used for customer support.' },
    ],
    documents: [
      { id: 'web', title: 'Product web page', audience: 'Customers', owner: 'Web editor', purpose: 'Help a customer decide whether to order the lamp.', fields: [{label:'First deliveries',source:'date'},{label:'Price',source:'price'}] },
      { id: 'sales', title: 'Sales sheet', audience: 'Sales team', owner: 'Sales coordinator', purpose: 'Give sales colleagues the current price and availability.', fields: [{label:'First deliveries',source:'date'},{label:'Price',source:'price'}] },
      { id: 'support-guide', title: 'Support guide', audience: 'Support team', owner: 'Support lead', purpose: 'Direct customer questions to the right team.', fields: [{label:'Contact',source:'support'}] },
    ],
    aiRequest: 'The first delivery date is now 22 June. Find the publications using that date, prepare revised wording, and cite the product record for each proposed edit.',
    aiBrief: 'The product web page and sales sheet use the first delivery date. Their availability text should be reviewed for 22 June. The support guide uses the support address. Its recorded fields contain no delivery date.',
  },
  office: {
    id: 'office', title: 'An office move',
    intro: 'Your team is moving office. The staff announcement and mover booking use the planned move date. The office guide provides the address and access time. Several preparation tasks are scheduled relative to the move.',
    question: 'The move changes from 15 June to 17 June. What information and preparation dates need review?',
    sources: [
      { id: 'move', title: 'Move date', value: '15 June', proposed: '17 June', meaning: 'The planned date of the move. Preparation tasks use offsets from this date.' },
      { id: 'address', title: 'New office address', value: '18 Market Street', proposed: '24 Market Street', meaning: 'The destination used by staff and the moving company.' },
      { id: 'access', title: 'Access from', value: '08:00', proposed: '09:00', meaning: 'The time staff can enter the new office.' },
    ],
    documents: [
      { id: 'announcement', title: 'Staff announcement', audience: 'Staff', owner: 'Office coordinator', purpose: 'Tell colleagues when and where to move.', fields: [{label:'Move on',source:'move'},{label:'Address',source:'address'},{label:'Access from',source:'access'}] },
      { id: 'movers', title: 'Mover booking', audience: 'Moving company', owner: 'Facilities team', purpose: 'Specify the proposed moving date and destination.', fields: [{label:'Move on',source:'move'},{label:'Destination',source:'address'}] },
      { id: 'office-guide', title: 'Office guide', audience: 'Staff', owner: 'Office coordinator', purpose: 'Explain where the office is and when staff can enter.', fields: [{label:'Address',source:'address'},{label:'Access from',source:'access'}] },
    ],
    aiRequest: 'We are considering moving on 17 June. Find the documents and preparation tasks that use the move date. Draft the updates and identify which bookings need confirmation.',
    aiBrief: 'Review the staff announcement and mover booking for 17 June. With the recorded offsets, packing would move to 16 June and the first working day to 18 June. Confirm the moving company’s availability and tell colleagues about the revised plan. The lease start is recorded independently as 14 June.',
  },
};
export const moveTasks = [
  { id:'lease', title:'Lease starts', owner:'Facilities team', fixedDay:14, offset:null, rule:'Fixed date of 14 June', review:'The lease starts on 14 June in either plan.' },
  { id:'packing', title:'Pack desks', owner:'All staff', fixedDay:null, offset:-1, rule:'One day before the move', review:'Tell staff when packing needs to be finished.' },
  { id:'crew', title:'Moving crew arrives', owner:'Facilities team', fixedDay:null, offset:0, rule:'On the move date', review:'Confirm the revised date with the moving company.' },
  { id:'start', title:'Team starts in new office', owner:'Office coordinator', fixedDay:null, offset:1, rule:'One day after the move', review:'Update the staff announcement for the first working day.' },
];
export const proposals: Proposal[] = [
  { number:1, title:'Find the right course material', example:'training', method:'cards', methodName:'Document cards by audience', change:'A new example and visual starting point', instruction:'Choose Trainers to find the materials they use. Open a source link on a card to see where its information comes from.', lesson:'A document can be found through its audience, and its contents can point back to shared sources. The audience field makes filtering useful.', strength:'The audience filter has an immediate, familiar purpose. Each card explains what the reader gets.', limitation:'The effect of a room change is spread across several cards. Readers must compare the source links themselves.', verdict:'A clear entry point, with a modest demonstration of relationships.' },
  { number:2, title:'Follow a room change', example:'training', method:'map', methodName:'Source-to-document dependency map', change:'Changed the visualization from proposal 1', instruction:'Select Room booking. Follow the highlighted connections to the two materials that use it and the people who maintain them. Try Course topic next.', lesson:'A recorded relationship explains why a source change matters to a particular document. Following the links identifies work for review.', strength:'One selection exposes both the affected materials and their owners. Room, time and topic need little explanation.', limitation:'The small map shows direct dependencies. A larger example would need a way to follow further links without crowding the view.', verdict:'The strongest introductory explanation of connected information.' },
  { number:3, title:'Trace a product fact across publications', example:'product', method:'map', methodName:'Source-to-document dependency map', change:'Changed the example from proposal 2', instruction:'Select First delivery date to find the publications using it. Select Support address to see a different connection.', lesson:'The same product fact can be used in several publications. The links identify which publications to inspect when that fact changes.', strength:'The commercial consequence of an outdated date is easy to recognize. The support guide makes selective impact visible.', limitation:'Readers may focus on copying product facts and miss the wider idea of exploring records and relationships.', verdict:'A strong alternative for an audience working with product information.' },
  { number:4, title:'See the proposed publication changes', example:'product', method:'comparison', methodName:'Before-and-after document previews', change:'Changed the visualization from proposal 3', instruction:'Preview 22 June as the first delivery date. Compare the current and proposed text, then try changing the price or support address.', lesson:'Maintained fields can drive consistent changes across outputs. Comparing the results makes the reuse visible.', strength:'The outcome is tangible. Readers can see exactly which text would change.', limitation:'It closely repeats Chapter 7’s source-to-output lesson and puts less emphasis on exploring relationships.', verdict:'Effective demonstration, but weaker as the main idea for Chapter 9.' },
  { number:5, title:'Prepare the office-move updates', example:'office', method:'comparison', methodName:'Before-and-after document previews', change:'Changed the example from proposal 4', instruction:'Preview the move on 17 June. Check the staff announcement and mover booking, then inspect why the office guide keeps its current content.', lesson:'One shared planning fact can support several communications. Linked fields identify which proposed changes belong together.', strength:'An office move is broadly familiar, and the two audiences make coordinated updates easy to understand.', limitation:'The document previews still emphasize text changes. They do not show the knock-on effect on preparation dates.', verdict:'Accessible, although it overlaps with Chapter 7.' },
  { number:6, title:'See the move ripple through the plan', example:'office', method:'timeline', methodName:'Interactive dependency timeline', change:'Changed the visualization from proposal 5', instruction:'Preview a move on 17 June. Compare the original and proposed dates, then select Moving crew arrives to inspect the rule and follow-up action.', lesson:'Recorded relationships can be used to calculate a view. A changed source date reveals related tasks that need attention.', strength:'The consequences are visible immediately. Fixed and relative dates are easy to compare, and each task exposes its rule.', limitation:'The date calculations introduce another concept and can make the chapter feel like a scheduling lesson.', verdict:'The most engaging extension, best placed after a simpler relationship example.' },
];
