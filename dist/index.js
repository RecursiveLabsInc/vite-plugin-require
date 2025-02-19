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
exports.default = vitePluginRequire;
var parser_1 = require("@babel/parser");
var traverse_1 = require("@babel/traverse");
var generator_1 = require("@babel/generator");
var types_1 = require("@babel/types");
function vitePluginRequire(opts) {
    var _a = opts || {}, _b = _a.fileRegex, fileRegex = _b === void 0 ? /(.jsx?|.tsx?|.vue)$/ : _b, log = _a.log, _c = _a.translateType, translateType = _c === void 0 ? "import" : _c;
    var sourcemap;
    return {
        name: "vite-plugin-require",
        configResolved: function (resolvedConfig) {
            var isDev = resolvedConfig.env.MODE === "development";
            if (isDev) {
                sourcemap = true;
            }
            else {
                sourcemap = resolvedConfig.build.sourcemap;
            }
        },
        transform: function (code, id) {
            return __awaiter(this, void 0, void 0, function () {
                var newCode, newMap, isVueFile, plugins, ast_1, output;
                return __generator(this, function (_a) {
                    if (/\/node_modules\//g.test(id))
                        return [2];
                    newCode = code;
                    newMap = null;
                    if (fileRegex.test(id)) {
                        isVueFile = /(.vue)$/.test(id);
                        plugins = isVueFile ? [[require("vue-loader")]] : ["jsx"];
                        ast_1 = (0, parser_1.parse)(code, {
                            sourceType: "module",
                            plugins: plugins,
                        });
                        (0, traverse_1.default)(ast_1, {
                            enter: function (path) {
                                var _a, _b;
                                if (path.isIdentifier({ name: "require" })) {
                                    var arg = (_b = (_a = path.container) === null || _a === void 0 ? void 0 : _a.arguments) === null || _b === void 0 ? void 0 : _b[0];
                                    if (arg) {
                                        var stringVal_1 = "";
                                        switch (arg === null || arg === void 0 ? void 0 : arg.type) {
                                            case "StringLiteral":
                                                stringVal_1 = arg.value;
                                                break;
                                            case "Identifier":
                                                var IdentifierName_1 = arg.name;
                                                (0, traverse_1.default)(ast_1, {
                                                    Identifier: function (path) {
                                                        var _a;
                                                        if (path.node.name === IdentifierName_1) {
                                                            if (!Array.isArray(path.container) && ((_a = path.container.init) === null || _a === void 0 ? void 0 : _a.type) === "StringLiteral") {
                                                                stringVal_1 = path.container.init.value;
                                                            }
                                                        }
                                                    },
                                                });
                                                break;
                                            case "BinaryExpression":
                                                var binaryExpressionLoopFn_1 = function (lOr) {
                                                    if (lOr.type === "BinaryExpression") {
                                                        binaryExpressionLoopFn_1(lOr.left);
                                                        binaryExpressionLoopFn_1(lOr.right);
                                                    }
                                                    else {
                                                        if (lOr.type === "StringLiteral") {
                                                            stringVal_1 += lOr.value;
                                                        }
                                                        else if (lOr.type === "Identifier") {
                                                            var IdentifierName_2 = lOr.name;
                                                            (0, traverse_1.default)(ast_1, {
                                                                Identifier: function (path) {
                                                                    var _a;
                                                                    if (path.node.name === IdentifierName_2) {
                                                                        if (!Array.isArray(path.container) && ((_a = path.container.init) === null || _a === void 0 ? void 0 : _a.type) === "StringLiteral") {
                                                                            stringVal_1 += path.container.init.value;
                                                                        }
                                                                    }
                                                                },
                                                            });
                                                        }
                                                        else if (lOr.type === "MemberExpression") {
                                                            if (lOr.property.type === "Identifier") {
                                                                var IdentifierName_3 = lOr.property.name;
                                                                (0, traverse_1.default)(ast_1, {
                                                                    Identifier: function (path) {
                                                                        var _a;
                                                                        if (path.node.name === IdentifierName_3) {
                                                                            if (!Array.isArray(path.container) && ((_a = path.container.init) === null || _a === void 0 ? void 0 : _a.type) === "StringLiteral") {
                                                                                stringVal_1 += path.container.init.value;
                                                                            }
                                                                        }
                                                                    },
                                                                });
                                                            }
                                                        }
                                                        else {
                                                            throw "\u4E0D\u652F\u6301\u7684: BinaryExpression \u7EC4\u6210\u7C7B\u578B ".concat(lOr.type);
                                                        }
                                                    }
                                                };
                                                binaryExpressionLoopFn_1(arg.left);
                                                binaryExpressionLoopFn_1(arg.right);
                                                break;
                                            case "MemberExpression":
                                                break;
                                            default:
                                                throw "Unsupported type: ".concat(arg === null || arg === void 0 ? void 0 : arg.type);
                                        }
                                        path.node.name = "";
                                        if (stringVal_1) {
                                            var realPath = "vitePluginRequire_".concat(new Date().getTime(), "_").concat(parseInt(Math.random() * 100000000 + 100 + ""));
                                            if (translateType === "import") {
                                                var importAst = (0, types_1.importDeclaration)([(0, types_1.importDefaultSpecifier)((0, types_1.identifier)(realPath))], (0, types_1.stringLiteral)(stringVal_1));
                                                ast_1.program.body.unshift(importAst);
                                                switch (arg === null || arg === void 0 ? void 0 : arg.type) {
                                                    case "StringLiteral":
                                                        path.container.arguments[0].value = realPath;
                                                        if (path.container.arguments[0].extra) {
                                                            path.container.arguments[0].extra.raw = realPath;
                                                            path.container.arguments[0].extra.rawValue = realPath;
                                                        }
                                                        break;
                                                    case "Identifier":
                                                        path.container.arguments[0].name = realPath;
                                                        break;
                                                    case "BinaryExpression":
                                                        path.container.arguments[0] = (0, types_1.identifier)(realPath);
                                                        break;
                                                    default:
                                                        throw "Unsupported type: ".concat(arg === null || arg === void 0 ? void 0 : arg.type);
                                                }
                                            }
                                            else if (translateType === "importMetaUrl") {
                                                var metaObj = (0, types_1.memberExpression)((0, types_1.memberExpression)((0, types_1.identifier)("import"), (0, types_1.identifier)("meta")), (0, types_1.identifier)("url"));
                                                var importAst = (0, types_1.newExpression)((0, types_1.identifier)("URL"), [(0, types_1.stringLiteral)(stringVal_1), metaObj]);
                                                var hrefObj = (0, types_1.expressionStatement)((0, types_1.memberExpression)(importAst, (0, types_1.identifier)("href")));
                                                var strCode = (0, generator_1.default)(hrefObj, {}).code.replace(/\;$/, '');
                                                switch (arg === null || arg === void 0 ? void 0 : arg.type) {
                                                    case "StringLiteral":
                                                        path.container.arguments[0].value = strCode;
                                                        if (path.container.arguments[0].extra) {
                                                            path.container.arguments[0].extra.raw = strCode;
                                                            path.container.arguments[0].extra.rawValue = strCode;
                                                        }
                                                        break;
                                                    case "Identifier":
                                                        path.container.arguments[0].name = strCode;
                                                        break;
                                                    case "BinaryExpression":
                                                        path.container.arguments[0] = (0, types_1.identifier)(strCode);
                                                        break;
                                                    default:
                                                        throw "Unsupported type: ".concat(arg === null || arg === void 0 ? void 0 : arg.type);
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        });
                        output = (0, generator_1.default)(ast_1, {
                            sourceMaps: true,
                            sourceFileName: id
                        }, code);
                        newCode = output.code;
                        if (sourcemap) {
                            newMap = output.map;
                        }
                    }
                    return [2, {
                            code: newCode,
                            map: newMap,
                        }];
                });
            });
        },
    };
}
//# sourceMappingURL=index.js.map