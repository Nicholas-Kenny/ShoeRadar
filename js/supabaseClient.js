// window.db = window.supabase.createClient(
//     "https://cqiphekxrfnczirklpuo.supabase.co",
//     "sb_publishable_3-AbYfVbE9WNMfXB5l68Jg_ccamtz9W"
// );

// console.log(window.db);

// js/supabaseClient.js

const SUPABASE_URL = "https://lyylvzyvwwnocjspyphb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SuJtjjHxCLcrS92yMAId1Q_EXu1yIhp";

window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase Client Berhasil Diinisialisasi");
