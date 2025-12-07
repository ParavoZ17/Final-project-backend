export const usernameRegexp: RegExp = /^[A-Za-z0-9_]+$/
export const emailRegexp:RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const fullNameRegexp:RegExp = /^[A-Za-z ]+$/;
export const passwordRegexp:RegExp = /^(?=.*[A-ZА-ЯЁЇІЄҐ])(?=.*\d)[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\d]+$/;