/**
 * AEM Content Fragment delivery for data-driven blocks (e.g. majors).
 *
 * Persisted queries on the AEM publish tier: public, read-only and cacheable, so they
 * are safe to call from browsers. Never add author-tier URLs or credentials here:
 * everything in this file is served to visitors.
 */
export default {
  endpoint: 'https://publish-p130746-e1275972.adobeaemcloud.com/graphql/execute.json/ref-demo-eds',
  queries: {
    facultyList: 'FacultyList',
    facultyByPath: 'GetFacultyByPath', // variable: path
  },
  /** Content fragment paths blocks may request */
  pathPattern: /^\/content\/dam\/sfu\/[A-Za-z0-9/_-]+$/,
};
