use std::ffi::{CStr, CString};
use std::fs;
use std::os::raw::c_char;
use std::thread;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct User {
    id: String,
    username: String,
    email: String,
    gender: String,
    superadmin: bool,
    country: String,
}

#[unsafe(no_mangle)]
#[warn(forgetting_copy_types)]
pub extern "C" fn user_has_admin(data: *const u8, data_len: usize) -> *const u8 {
    let slice = unsafe { std::slice::from_raw_parts(data, data_len) };
    let data = String::from_utf8_lossy(slice);

    let users: Vec<User> = serde_json::from_str(&data).expect("Error on convert to JSON");

    let threads = num_cpus::get();
    let chunk_size = users.len() / threads + 1;

    let mut handles = vec![];

    for chunk in users.chunks(chunk_size) {
        let local_chunk = chunk.to_vec();
        let th = thread::spawn(move || {
            let superadmins = local_chunk.into_iter().filter(|u| u.superadmin).map(|u| u);
            superadmins
        });
        handles.push(th);
    }

    let mut total_superadmins = Vec::new();

    for handle in handles {
        let superadmins = handle.join().expect("Error on create thread");
        total_superadmins.extend(superadmins);
    }

    let json_string = serde_json::to_string(&total_superadmins).unwrap();
    let ptr = json_string.as_ptr();
    ptr
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn read_file(directory: *const c_char) -> *const c_char {
    let c_str = unsafe { CStr::from_ptr(directory) };
    let path = match c_str.to_str() {
        Ok(s) => s,
        Err(_) => return std::ptr::null(),
    };
    let content = match fs::read_to_string(path) {
        Ok(result) => result,
        Err(_) => return std::ptr::null(),
    };
    let c_content = match CString::new(content) {
        Ok(c) => c,
        Err(_) => return std::ptr::null(),
    };
    c_content.into_raw()
}

// #[unsafe(no_mangle)]
// pub extern "C" fn free_user_has_admin(ptr: *mut u8, len: usize) {
//     if !ptr.is_null() && len > 0 {
//         unsafe {
//             let _ = Vec::from_raw_parts(ptr, len, len);
//         }
//     }
// }
