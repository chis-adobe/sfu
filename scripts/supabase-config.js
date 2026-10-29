/**
 * Browser-safe Supabase connection for data-driven blocks (e.g. facilities).
 *
 * Only ever use the project's public anon / publishable key here, with Row Level
 * Security allowing read-only (SELECT) access to the views below. Never put a
 * service_role or secret key in this file: everything here is served to browsers.
 *
 * Blocks can override the view/column settings in their authored content.
 */
export default {
  url: 'https://wdgjvnbgtulfuevdtvjk.supabase.co', // project API URL
  publishableKey: '', // publishable key (sb_publishable_…), added by the project owner
  facilities: {
    table: 'facilities_by_category', // view: one row per facility per category
    categoryColumn: 'category_code', // filter value
    categoryLabelColumn: 'category_name', // dropdown label
    orderBy: 'facility_name',
    fields: 'facility_id,facility_name,type,campus,description,url',
  },
};
