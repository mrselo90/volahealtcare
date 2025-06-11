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
var fs = require("fs");
var path = require("path");
var csv_parse_1 = require("csv-parse");
var sourceDir = '/Users/sboyuk/Downloads/site files - 3259dbf8-b5f5-4c4b-8b45-77eb0bf339c6';
var outputDir = path.join(__dirname, '../public/images/services');
var csvFilePath = path.join(__dirname, '../Dental+Treatments+Detail-02.06.2025.csv');
// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
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
// Function to copy file
var copyFile = function (source, destination) {
    return new Promise(function (resolve, reject) {
        fs.copyFile(source, destination, function (err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
};
// Image mapping for specific services
var imageMapping = {
    'bbl-detail': ['before-after'],
    'teeth-whitening-detail': ['dental-veneers', 'dental-crowns'],
    'facelift-surgery-detail': ['brow-lifting', 'forehead'],
    'hollywood-smile-detail': ['dental-veneers', 'dental-crowns', 'dsd'],
    'neck-lift-detail': ['neck-lifting'],
    'botox-detail': ['jawline-filler'],
    'digital-smile-design-detail': ['dsd', 'dental'],
    'dental-veneers-detail': ['dental-veneers', 'dental-crowns'],
    'six-pack-detail': ['shutterstock'],
    'gum-aesthetic-detail': ['periodontal'],
    'breast-augmentation-detail': ['before-after'],
    'thigh-lift-detail': ['thigh-lift'],
    'tummy-tuck-detail': ['shutterstock'],
    'nose-aesthetics-rhinoplasty-detail': ['before-after'],
    'zircon-detail': ['dental-crowns', 'dental-veneers'],
    'fat-transfer-to-face-detail': ['fat-transfer'],
    'liposuction-detail': ['before-after'],
    'implant-detail-2': ['dental-crowns', 'root-canal'],
    'brow-lift-detail': ['brow-lifting', 'forehead'],
    'dental-crowns-detail': ['dental-crowns'],
    'jaw-surgery-detail': ['jawline'],
    'implant-detail': ['dental-crowns', 'root-canal'],
    'arm-lift-detail': ['arm-lifting'],
    'gynecomastia-detail': ['gynecomastia'],
    'canal-root-detail': ['root-canal'],
    'breast-reduction-detail': ['before-after'],
    'breast-lift-detail': ['before-after'],
    'bichectomy-detail': ['bichectomia']
};
// Get all image files from source directory
var sourceFiles = fs.readdirSync(sourceDir)
    .filter(function (file) { return /\.(jpg|jpeg|png|webp)$/i.test(file); });
// Read and parse CSV file
var csvContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
(0, csv_parse_1.parse)(csvContent, {
    columns: true,
    delimiter: ',',
    trim: true,
    skip_empty_lines: true,
    relax_quotes: true,
    bom: true
}, function (err, records) { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, _i, records_1, row;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (err) {
                    console.error('Error parsing CSV:', err);
                    return [2 /*return*/];
                }
                _loop_1 = function (row) {
                    var title, sanitizedTitle, matchingFile, mappedKeywords, _loop_2, _b, mappedKeywords_1, keyword, state_1, keywords_1, sourcePath, extension, outputPath, error_1, error_2;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 5, , 6]);
                                title = row.Title;
                                if (!title) {
                                    console.log('Skipping row with no title');
                                    return [2 /*return*/, "continue"];
                                }
                                sanitizedTitle = sanitizeFilename(title);
                                matchingFile = null;
                                mappedKeywords = imageMapping[sanitizedTitle] || [];
                                _loop_2 = function (keyword) {
                                    var found = sourceFiles.find(function (file) {
                                        return file.toLowerCase().includes(keyword.toLowerCase());
                                    });
                                    if (found) {
                                        matchingFile = found;
                                        return "break";
                                    }
                                };
                                for (_b = 0, mappedKeywords_1 = mappedKeywords; _b < mappedKeywords_1.length; _b++) {
                                    keyword = mappedKeywords_1[_b];
                                    state_1 = _loop_2(keyword);
                                    if (state_1 === "break")
                                        break;
                                }
                                // If no match found through mapping, try the title keywords
                                if (!matchingFile) {
                                    keywords_1 = sanitizedTitle.split('-');
                                    matchingFile = sourceFiles.find(function (file) {
                                        var lowerFile = file.toLowerCase();
                                        return keywords_1.some(function (keyword) { return lowerFile.includes(keyword); });
                                    });
                                }
                                if (!matchingFile) {
                                    console.log("No matching image found for ".concat(title));
                                    return [2 /*return*/, "continue"];
                                }
                                sourcePath = path.join(sourceDir, matchingFile);
                                extension = path.extname(matchingFile);
                                outputPath = path.join(outputDir, "".concat(sanitizedTitle).concat(extension));
                                console.log("Copying image for ".concat(title, "..."));
                                console.log("From: ".concat(sourcePath));
                                console.log("To: ".concat(outputPath));
                                _c.label = 1;
                            case 1:
                                _c.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, copyFile(sourcePath, outputPath)];
                            case 2:
                                _c.sent();
                                console.log("Successfully copied image for ".concat(title));
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _c.sent();
                                console.error("Failed to copy image for ".concat(title, ":"), error_1.message);
                                return [3 /*break*/, 4];
                            case 4: return [3 /*break*/, 6];
                            case 5:
                                error_2 = _c.sent();
                                console.error("Error processing ".concat(row.Title, ":"), error_2);
                                return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, records_1 = records;
                _a.label = 1;
            case 1:
                if (!(_i < records_1.length)) return [3 /*break*/, 4];
                row = records_1[_i];
                return [5 /*yield**/, _loop_1(row)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                console.log('Finished processing all services');
                return [2 /*return*/];
        }
    });
}); });
