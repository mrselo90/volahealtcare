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
var fs = require("fs");
var path = require("path");
var csv_parse_1 = require("csv-parse");
var prisma = new client_1.PrismaClient();
var csvFilePath = path.join(__dirname, '../Dental+Treatments+Detail.csv');
// Function to sanitize slug
var sanitizeSlug = function (text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};
// Function to generate placeholder image filename
var getImageFilename = function (title) {
    var slug = sanitizeSlug(title);
    return "/images/services/".concat(slug, ".svg");
};
// Function to determine category based on title or description
var determineCategory = function (title, description) {
    var lowerTitle = title.toLowerCase();
    var lowerDesc = description.toLowerCase();
    if (lowerTitle.includes('dental') ||
        lowerTitle.includes('teeth') ||
        lowerTitle.includes('smile') ||
        lowerTitle.includes('gum') ||
        lowerTitle.includes('implant') ||
        lowerTitle.includes('crown') ||
        lowerTitle.includes('root')) {
        return 'Dental Aesthetics';
    }
    if (lowerTitle.includes('face') ||
        lowerTitle.includes('nose') ||
        lowerTitle.includes('eye') ||
        lowerTitle.includes('brow') ||
        lowerTitle.includes('botox') ||
        lowerTitle.includes('lift') ||
        lowerDesc.includes('facial')) {
        return 'Facial Aesthetics';
    }
    return 'Body Aesthetics';
};
function importServices() {
    return __awaiter(this, void 0, void 0, function () {
        var csvContent;
        var _this = this;
        return __generator(this, function (_a) {
            csvContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
            (0, csv_parse_1.parse)(csvContent, {
                columns: true,
                delimiter: ',',
                trim: true,
                skip_empty_lines: true,
                relax_quotes: true,
                bom: true,
            }, function (err, records) { return __awaiter(_this, void 0, void 0, function () {
                var _i, records_1, row, title, description, longDescription, category, slug, imageUrl, service, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                console.error('Error parsing CSV:', err);
                                return [2 /*return*/];
                            }
                            _i = 0, records_1 = records;
                            _a.label = 1;
                        case 1:
                            if (!(_i < records_1.length)) return [3 /*break*/, 6];
                            row = records_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            title = row.Title;
                            if (!title)
                                return [3 /*break*/, 5];
                            description = row['Metin 1'] || '';
                            longDescription = row['Metin 3'] || '';
                            category = determineCategory(title, description);
                            slug = sanitizeSlug(title);
                            imageUrl = getImageFilename(title);
                            return [4 /*yield*/, prisma.service.upsert({
                                    where: { slug: slug },
                                    create: {
                                        title: title,
                                        slug: slug,
                                        description: description,
                                        category: category,
                                        translations: {
                                            create: [
                                                {
                                                    language: 'en',
                                                    title: title,
                                                    description: description,
                                                    slug: slug,
                                                },
                                            ],
                                        },
                                        images: {
                                            create: [
                                                {
                                                    url: imageUrl,
                                                    alt: title,
                                                },
                                            ],
                                        },
                                    },
                                    update: {
                                        title: title,
                                        description: description,
                                        category: category,
                                        translations: {
                                            upsert: {
                                                where: {
                                                    serviceId_language: {
                                                        serviceId: '', // Will be filled in the next step
                                                        language: 'en',
                                                    },
                                                },
                                                create: {
                                                    language: 'en',
                                                    title: title,
                                                    description: description,
                                                    slug: slug,
                                                },
                                                update: {
                                                    title: title,
                                                    description: description,
                                                },
                                            },
                                        },
                                    },
                                    include: {
                                        translations: true,
                                    },
                                })];
                        case 3:
                            service = _a.sent();
                            console.log("Imported service: ".concat(title));
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error("Error importing service ".concat(row.Title, ":"), error_1);
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6:
                            console.log('Finished importing all services');
                            return [4 /*yield*/, prisma.$disconnect()];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
importServices().catch(console.error);
