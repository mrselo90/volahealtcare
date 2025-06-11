"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var path = require("path");
var fs = require("fs");
var prisma = new client_1.PrismaClient();
// Function to sanitize filename
var sanitizeFilename = function (title) {
    if (!title)
        return '';
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};
function updateServiceImages() {
    return __awaiter(this, void 0, void 0, function () {
        var services, _i, services_1, service, translation, sanitizedTitle, possibleExtensions, imagePath, _a, possibleExtensions_1, ext, testPath, altSanitizedTitle, _b, possibleExtensions_2, ext, testPath, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, 10, 12]);
                    return [4 /*yield*/, prisma.service.findMany({
                            include: {
                                images: true,
                                translations: {
                                    orderBy: {
                                        language: 'asc'
                                    }
                                }
                            }
                        })];
                case 1:
                    services = _c.sent();
                    _i = 0, services_1 = services;
                    _c.label = 2;
                case 2:
                    if (!(_i < services_1.length)) return [3 /*break*/, 8];
                    service = services_1[_i];
                    translation = service.translations.find(function (t) { return t.language === 'en'; }) ||
                        service.translations.find(function (t) { return t.language === 'tr'; });
                    if (!translation) {
                        console.log("No translation found for service ID: ".concat(service.id));
                        return [3 /*break*/, 7];
                    }
                    sanitizedTitle = sanitizeFilename(translation.title + ' detail');
                    possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
                    imagePath = '';
                    for (_a = 0, possibleExtensions_1 = possibleExtensions; _a < possibleExtensions_1.length; _a++) {
                        ext = possibleExtensions_1[_a];
                        testPath = path.join(process.cwd(), 'public', 'images', 'services', "".concat(sanitizedTitle).concat(ext));
                        console.log("Checking path: ".concat(testPath));
                        if (fs.existsSync(testPath)) {
                            imagePath = "/images/services/".concat(sanitizedTitle).concat(ext);
                            break;
                        }
                    }
                    if (!imagePath) {
                        altSanitizedTitle = sanitizeFilename(translation.title);
                        for (_b = 0, possibleExtensions_2 = possibleExtensions; _b < possibleExtensions_2.length; _b++) {
                            ext = possibleExtensions_2[_b];
                            testPath = path.join(process.cwd(), 'public', 'images', 'services', "".concat(altSanitizedTitle).concat(ext));
                            console.log("Checking alternative path: ".concat(testPath));
                            if (fs.existsSync(testPath)) {
                                imagePath = "/images/services/".concat(altSanitizedTitle).concat(ext);
                                break;
                            }
                        }
                    }
                    if (!imagePath) {
                        console.log("No image found for service: ".concat(translation.title));
                        return [3 /*break*/, 7];
                    }
                    if (!(service.images.length > 0)) return [3 /*break*/, 4];
                    // Update existing image
                    return [4 /*yield*/, prisma.image.update({
                            where: { id: service.images[0].id },
                            data: {
                                url: imagePath,
                                alt: translation.title
                            }
                        })];
                case 3:
                    // Update existing image
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4: 
                // Create new image
                return [4 /*yield*/, prisma.image.create({
                        data: {
                            url: imagePath,
                            alt: translation.title,
                            serviceId: service.id
                        }
                    })];
                case 5:
                    // Create new image
                    _c.sent();
                    _c.label = 6;
                case 6:
                    console.log("Updated image for service: ".concat(translation.title, " with path: ").concat(imagePath));
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8:
                    console.log('Successfully updated all service images');
                    return [3 /*break*/, 12];
                case 9:
                    error_1 = _c.sent();
                    console.error('Error updating service images:', error_1);
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, prisma.$disconnect()];
                case 11:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
updateServiceImages();
