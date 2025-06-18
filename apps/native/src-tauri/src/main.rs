// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// use tauri::{Manager, Window};

fn main() {
    native_lib::run();

    tauri::Builder::default()
        .setup(|app| {
            // Use get_webview_window instead of get_window
            let window = app.get_webview_window("main").unwrap(); // Get the main window
            // Change location to a remote URL or localhost in dev
            // let url = "https://armony.ai";
            let url = if cfg!(debug_assertions) {
                "http://localhost:3000/desktop-sign-in"
            } else {
                "https://armony.ai"
            };
            window.eval(&format!("window.location.replace('{}')", url)).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error running tauri app");
}