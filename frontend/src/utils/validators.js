/**
 * MasterFix Frontend Validation Helper
 * Mirrors Backend DTO Validation Rules
 */

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email boş ola bilməz";
    if (!re.test(email)) return "Düzgün email formatı daxil edin";
    return null;
};

export const validateRequired = (value, fieldName = "Bu sahə") => {
    if (!value || (typeof value === "string" && !value.trim())) {
        return `${fieldName} boş ola bilməz`;
    }
    return null;
};

export const validateMinLength = (value, min, fieldName = "Bu sahə") => {
    if (value && value.length < min) {
        return `${fieldName} ən azı ${min} simvoldan ibarət olmalıdır`;
    }
    return null;
};

export const validateMaxLength = (value, max, fieldName = "Bu sahə") => {
    if (value && value.length > max) {
        return `${fieldName} maksimum ${max} simvol ola bilər`;
    }
    return null;
};

export const validateRange = (value, min, max, fieldName = "Bu sahə") => {
    const num = Number(value);
    if (isNaN(num)) return "Düzgün rəqəm daxil edin";
    if (num < min) return `${fieldName} minimum ${min} olmalıdır`;
    if (num > max) return `${fieldName} maksimum ${max} ola bilər`;
    return null;
};

export const validatePositive = (value, fieldName = "Bu sahə") => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) return `${fieldName} sıfırdan böyük olmalıdır`;
    return null;
};

export const validatePositiveOrZero = (value, fieldName = "Bu sahə") => {
    const num = Number(value);
    if (isNaN(num) || num < 0) return `${fieldName} mənfi ola bilməz`;
    return null;
};

export const validators = {
    register: (data) => {
        const errors = {};
        errors.firstName = validateRequired(data.firstName, "Ad");
        errors.lastName = validateRequired(data.lastName, "Soyad");
        errors.userName = validateRequired(data.userName, "İstifadəçi adı");
        errors.email = validateEmail(data.email);
        errors.password = validateMinLength(data.password, 6, "Şifrə") || validateRequired(data.password, "Şifrə");
        errors.phone = validateRequired(data.phone, "Telefon nömrəsi");
        
        return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
    },
    
    login: (data) => {
        const errors = {};
        errors.email = validateEmail(data.email);
        errors.password = validateRequired(data.password, "Şifrə");
        return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
    },
    
    updateUser: (data) => {
        const errors = {};
        errors.firstName = validateRequired(data.firstName, "Ad");
        errors.lastName = validateRequired(data.lastName, "Soyad");
        errors.phone = validateRequired(data.phone, "Telefon nömrəsi");
        return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
    },
    
    master: (data) => {
        const errors = {};
        errors.categoryId = validateRequired(data.categoryId, "Kateqoriya");
        errors.description = validateMaxLength(data.description, 1000, "Təsvir") || validateRequired(data.description, "Təsvir");
        errors.experienceYear = validateRange(data.experienceYear, 0, 50, "Təcrübə ili") || validateRequired(data.experienceYear, "Təcrübə ili");
        errors.city = validateRequired(data.city, "Şəhər");
        errors.address = validateRequired(data.address, "Ünvan");
        errors.priceFrom = validatePositiveOrZero(data.priceFrom, "Minimum qiymət") || validateRequired(data.priceFrom, "Minimum qiymət");
        errors.priceTo = validatePositive(data.priceTo, "Maksimum qiymət") || validateRequired(data.priceTo, "Maksimum qiymət");
        
        if (Number(data.priceFrom) > Number(data.priceTo)) {
            errors.priceTo = "Maksimum qiymət minimum qiymətdən kiçik ola bilməz";
        }
        
        return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
    },
    
    booking: (data) => {
        const errors = {};
        errors.description = validateRequired(data.description, "Sifariş təsviri");
        errors.address = validateRequired(data.address, "Ünvan");
        errors.bookingDate = validateRequired(data.bookingDate, "Sifariş tarixi");
        
        if (data.bookingDate && new Date(data.bookingDate) < new Date()) {
            errors.bookingDate = "Sifariş tarixi keçmiş zaman ola bilər";
        }
        
        return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
    },
    
    review: (data) => {
        const errors = {};
        errors.rating = validateRange(data.rating, 1, 5, "Rating") || validateRequired(data.rating, "Rating");
        errors.comment = validateMaxLength(data.comment, 1000, "Rəy");
        return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
    },

    category: (data) => {
        const errors = {};
        errors.name = validateRange(data.name?.length, 2, 50, "Kateqoriya adı") || validateRequired(data.name, "Kateqoriya adı");
        errors.description = validateRequired(data.description, "Kateqoriya təsviri");
        return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
    }
};

/**
 * Backendden gelen 400 xetalarini (field-level) map etmek ucun
 */
export const mapBackendErrors = (errorResponse) => {
    if (errorResponse && typeof errorResponse === 'object') {
        // Spring Boot Standard Validation Response: { fieldName: "message" }
        // bezen ise { errors: { fieldName: "message" } }
        return errorResponse.errors || errorResponse;
    }
    return {};
};
