'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
}

function getTagFilesMap(app) {
    var metadataCache = app.metadataCache;
    var markdownFiles = app.vault.getMarkdownFiles();
    var tagFilesMap = {};
    for (var _i = 0, markdownFiles_1 = markdownFiles; _i < markdownFiles_1.length; _i++) {
        var markdownFile = markdownFiles_1[_i];
        var cachedMetadata = metadataCache.getFileCache(markdownFile);
        if (cachedMetadata && cachedMetadata.tags) {
            for (var _a = 0, _b = cachedMetadata.tags; _a < _b.length; _a++) {
                var cachedTag = _b[_a];
                if (tagFilesMap[cachedTag.tag]) {
                    tagFilesMap[cachedTag.tag].push(markdownFile.path);
                }
                else {
                    tagFilesMap[cachedTag.tag] = [markdownFile.path];
                }
            }
        }
    }
    return tagFilesMap;
}
function randomElement(array) {
    return array[(array.length * Math.random()) << 0];
}

var SmartRandomNoteSettingTab = /** @class */ (function (_super) {
    __extends(SmartRandomNoteSettingTab, _super);
    function SmartRandomNoteSettingTab(plugin) {
        var _this = _super.call(this, plugin.app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    SmartRandomNoteSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Smart Random Note Settings ' });
        new obsidian.Setting(containerEl)
            .setName('Open in New Leaf')
            .setDesc('Default setting for opening random notes')
            .addToggle(function (toggle) {
            toggle.setValue(_this.plugin.settings.openInNewLeaf);
            toggle.onChange(_this.plugin.setOpenInNewLeaf);
        });
        new obsidian.Setting(containerEl)
            .setName('Enable Ribbon Icon')
            .setDesc('Place an icon on the ribbon to open a random note from search')
            .addToggle(function (toggle) {
            toggle.setValue(_this.plugin.settings.enableRibbonIcon);
            toggle.onChange(_this.plugin.setEnableRibbonIcon);
        });
    };
    return SmartRandomNoteSettingTab;
}(obsidian.PluginSettingTab));

var OpenRandomTaggedNoteModal = /** @class */ (function (_super) {
    __extends(OpenRandomTaggedNoteModal, _super);
    function OpenRandomTaggedNoteModal(app, tags) {
        var _this = _super.call(this, app) || this;
        _this.selectedTag = '';
        _this.firstKeyUpHandled = false;
        _this.submitCallback = undefined;
        _this.onOpen = function () {
            _this.contentEl.createEl('h3', { text: 'Select Tag' });
            var tagDropdown = new obsidian.DropdownComponent(_this.contentEl).onChange(function (value) { return (_this.selectedTag = value); });
            for (var _i = 0, _a = _this.tags; _i < _a.length; _i++) {
                var tag = _a[_i];
                tagDropdown.addOption(tag, tag);
            }
            tagDropdown.setValue(_this.selectedTag);
            new obsidian.ButtonComponent(_this.contentEl).setButtonText('Submit').setCta().onClick(_this.submit);
            document.addEventListener('keyup', _this.handleKeyUp);
        };
        _this.handleKeyUp = function (event) {
            if (_this.firstKeyUpHandled && event.key == 'Enter') {
                _this.submit();
            }
            _this.firstKeyUpHandled = true;
        };
        _this.submit = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.submitCallback) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.submitCallback()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.close();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onClose = function () {
            document.removeEventListener('keyup', _this.handleKeyUp);
        };
        _this.tags = tags;
        _this.selectedTag = tags[0];
        return _this;
    }
    return OpenRandomTaggedNoteModal;
}(obsidian.Modal));

var SmartRandomNoteNotice = /** @class */ (function (_super) {
    __extends(SmartRandomNoteNotice, _super);
    function SmartRandomNoteNotice(message, timeout) {
        return _super.call(this, 'Smart Random Note: ' + message, timeout) || this;
    }
    return SmartRandomNoteNotice;
}(obsidian.Notice));

var SmartRandomNotePlugin = /** @class */ (function (_super) {
    __extends(SmartRandomNotePlugin, _super);
    function SmartRandomNotePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.settings = { openInNewLeaf: true, enableRibbonIcon: true };
        _this.ribbonIconEl = undefined;
        _this.onunload = function () {
            console.log('unloading smart-random-note');
        };
        _this.handleOpenRandomNote = function () { return __awaiter(_this, void 0, void 0, function () {
            var markdownFiles, filePaths;
            return __generator(this, function (_a) {
                markdownFiles = this.app.vault.getMarkdownFiles();
                filePaths = markdownFiles.map(function (x) { return x.path; });
                this.openRandomNote(filePaths);
                return [2 /*return*/];
            });
        }); };
        _this.handleOpenTaggedRandomNote = function () {
            var tagFilesMap = getTagFilesMap(_this.app);
            var tags = Object.keys(tagFilesMap);
            var modal = new OpenRandomTaggedNoteModal(_this.app, tags);
            modal.submitCallback = function () { return __awaiter(_this, void 0, void 0, function () {
                var taggedFiles;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            taggedFiles = tagFilesMap[modal.selectedTag];
                            return [4 /*yield*/, this.openRandomNote(taggedFiles)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            modal.open();
        };
        _this.handleOpenRandomNoteFromSearch = function () { return __awaiter(_this, void 0, void 0, function () {
            var searchView, searchResults;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        searchView = (_a = this.app.workspace.getLeavesOfType('search')[0]) === null || _a === void 0 ? void 0 : _a.view;
                        if (!searchView) {
                            new SmartRandomNoteNotice('The core search plugin is not enabled', 5000);
                            return [2 /*return*/];
                        }
                        searchResults = searchView.dom.resultDoms.map(function (x) { return x.file.basename; });
                        if (!searchResults.length) {
                            new SmartRandomNoteNotice('No search results available', 5000);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.openRandomNote(searchResults)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.openRandomNote = function (filePaths) { return __awaiter(_this, void 0, void 0, function () {
            var filePathToOpen;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePathToOpen = randomElement(filePaths);
                        return [4 /*yield*/, this.app.workspace.openLinkText(filePathToOpen, '', this.settings.openInNewLeaf, { active: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.loadSettings = function () { return __awaiter(_this, void 0, void 0, function () {
            var loadedSettings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData()];
                    case 1:
                        loadedSettings = (_a.sent());
                        if (loadedSettings) {
                            this.setOpenInNewLeaf(loadedSettings.openInNewLeaf);
                            this.setEnableRibbonIcon(loadedSettings.enableRibbonIcon);
                        }
                        else {
                            this.refreshRibbonIcon();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        _this.setOpenInNewLeaf = function (value) {
            _this.settings.openInNewLeaf = value;
            _this.saveData(_this.settings);
        };
        _this.setEnableRibbonIcon = function (value) {
            _this.settings.enableRibbonIcon = value;
            _this.refreshRibbonIcon();
            _this.saveData(_this.settings);
        };
        _this.refreshRibbonIcon = function () {
            var _a;
            (_a = _this.ribbonIconEl) === null || _a === void 0 ? void 0 : _a.remove();
            if (_this.settings.enableRibbonIcon) {
                _this.ribbonIconEl = _this.addRibbonIcon('dice', 'Open Random Note from Search', _this.handleOpenRandomNoteFromSearch);
            }
        };
        return _this;
    }
    SmartRandomNotePlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('loading smart-random-note');
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new SmartRandomNoteSettingTab(this));
                        this.addCommand({
                            id: 'open-random-note',
                            name: 'Open Random Note',
                            callback: this.handleOpenRandomNote,
                        });
                        this.addCommand({
                            id: 'open-tagged-random-note',
                            name: 'Open Tagged Random Note',
                            callback: this.handleOpenTaggedRandomNote,
                        });
                        this.addCommand({
                            id: 'open-random-note-from-search',
                            name: 'Open Random Note from Search',
                            callback: this.handleOpenRandomNoteFromSearch,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return SmartRandomNotePlugin;
}(obsidian.Plugin));

module.exports = SmartRandomNotePlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL3NyYy91dGlsaXRpZXMudHMiLCIuLi9zcmMvc2V0dGluZ1RhYi50cyIsIi4uL3NyYy9vcGVuUmFuZG9tVGFnZ2VkTm90ZU1vZGFsLnRzIiwiLi4vc3JjL3NtYXJ0UmFuZG9tTm90ZU5vdGljZS50cyIsIi4uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7IEFwcCB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFRhZ0ZpbGVzTWFwIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWdGaWxlc01hcChhcHA6IEFwcCk6IFRhZ0ZpbGVzTWFwIHtcbiAgICBjb25zdCBtZXRhZGF0YUNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGU7XG4gICAgY29uc3QgbWFya2Rvd25GaWxlcyA9IGFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XG5cbiAgICBjb25zdCB0YWdGaWxlc01hcDogVGFnRmlsZXNNYXAgPSB7fTtcblxuICAgIGZvciAoY29uc3QgbWFya2Rvd25GaWxlIG9mIG1hcmtkb3duRmlsZXMpIHtcbiAgICAgICAgY29uc3QgY2FjaGVkTWV0YWRhdGEgPSBtZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShtYXJrZG93bkZpbGUpO1xuXG4gICAgICAgIGlmIChjYWNoZWRNZXRhZGF0YSAmJiBjYWNoZWRNZXRhZGF0YS50YWdzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNhY2hlZFRhZyBvZiBjYWNoZWRNZXRhZGF0YS50YWdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZ0ZpbGVzTWFwW2NhY2hlZFRhZy50YWddKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhZ0ZpbGVzTWFwW2NhY2hlZFRhZy50YWddLnB1c2gobWFya2Rvd25GaWxlLnBhdGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhZ0ZpbGVzTWFwW2NhY2hlZFRhZy50YWddID0gW21hcmtkb3duRmlsZS5wYXRoXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFnRmlsZXNNYXA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21FbGVtZW50PFQ+KGFycmF5OiBUW10pOiBUIHtcbiAgICByZXR1cm4gYXJyYXlbKGFycmF5Lmxlbmd0aCAqIE1hdGgucmFuZG9tKCkpIDw8IDBdO1xufVxuIiwiaW1wb3J0IFNtYXJ0UmFuZG9tTm90ZVBsdWdpbiBmcm9tICcuL21haW4nO1xuaW1wb3J0IHsgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJztcblxuZXhwb3J0IGNsYXNzIFNtYXJ0UmFuZG9tTm90ZVNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgICBwbHVnaW46IFNtYXJ0UmFuZG9tTm90ZVBsdWdpbjtcblxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogU21hcnRSYW5kb21Ob3RlUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKHBsdWdpbi5hcHAsIHBsdWdpbik7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgIH1cblxuICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdTbWFydCBSYW5kb20gTm90ZSBTZXR0aW5ncyAnIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ09wZW4gaW4gTmV3IExlYWYnKVxuICAgICAgICAgICAgLnNldERlc2MoJ0RlZmF1bHQgc2V0dGluZyBmb3Igb3BlbmluZyByYW5kb20gbm90ZXMnKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm9wZW5Jbk5ld0xlYWYpO1xuICAgICAgICAgICAgICAgIHRvZ2dsZS5vbkNoYW5nZSh0aGlzLnBsdWdpbi5zZXRPcGVuSW5OZXdMZWFmKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0VuYWJsZSBSaWJib24gSWNvbicpXG4gICAgICAgICAgICAuc2V0RGVzYygnUGxhY2UgYW4gaWNvbiBvbiB0aGUgcmliYm9uIHRvIG9wZW4gYSByYW5kb20gbm90ZSBmcm9tIHNlYXJjaCcpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlUmliYm9uSWNvbik7XG4gICAgICAgICAgICAgICAgdG9nZ2xlLm9uQ2hhbmdlKHRoaXMucGx1Z2luLnNldEVuYWJsZVJpYmJvbkljb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBCdXR0b25Db21wb25lbnQsIERyb3Bkb3duQ29tcG9uZW50LCBNb2RhbCB9IGZyb20gJ29ic2lkaWFuJztcblxuZXhwb3J0IGNsYXNzIE9wZW5SYW5kb21UYWdnZWROb3RlTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gICAgdGFnczogc3RyaW5nW107XG4gICAgc2VsZWN0ZWRUYWcgPSAnJztcbiAgICBmaXJzdEtleVVwSGFuZGxlZCA9IGZhbHNlO1xuICAgIHN1Ym1pdENhbGxiYWNrOiAoKCkgPT4gUHJvbWlzZTx2b2lkPikgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgdGFnczogc3RyaW5nW10pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy50YWdzID0gdGFncztcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhZyA9IHRhZ3NbMF07XG4gICAgfVxuXG4gICAgb25PcGVuID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLmNvbnRlbnRFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdTZWxlY3QgVGFnJyB9KTtcblxuICAgICAgICBjb25zdCB0YWdEcm9wZG93biA9IG5ldyBEcm9wZG93bkNvbXBvbmVudCh0aGlzLmNvbnRlbnRFbCkub25DaGFuZ2UoKHZhbHVlKSA9PiAodGhpcy5zZWxlY3RlZFRhZyA9IHZhbHVlKSk7XG5cbiAgICAgICAgZm9yIChjb25zdCB0YWcgb2YgdGhpcy50YWdzKSB7XG4gICAgICAgICAgICB0YWdEcm9wZG93bi5hZGRPcHRpb24odGFnLCB0YWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFnRHJvcGRvd24uc2V0VmFsdWUodGhpcy5zZWxlY3RlZFRhZyk7XG5cbiAgICAgICAgbmV3IEJ1dHRvbkNvbXBvbmVudCh0aGlzLmNvbnRlbnRFbCkuc2V0QnV0dG9uVGV4dCgnU3VibWl0Jykuc2V0Q3RhKCkub25DbGljayh0aGlzLnN1Ym1pdCk7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleVVwKTtcbiAgICB9O1xuXG4gICAgaGFuZGxlS2V5VXAgPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RLZXlVcEhhbmRsZWQgJiYgZXZlbnQua2V5ID09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIHRoaXMuc3VibWl0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maXJzdEtleVVwSGFuZGxlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHN1Ym1pdCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3VibWl0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc3VibWl0Q2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfTtcblxuICAgIG9uQ2xvc2UgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXlVcCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IE5vdGljZSB9IGZyb20gJ29ic2lkaWFuJztcblxuZXhwb3J0IGNsYXNzIFNtYXJ0UmFuZG9tTm90ZU5vdGljZSBleHRlbmRzIE5vdGljZSB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCB0aW1lb3V0PzogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCdTbWFydCBSYW5kb20gTm90ZTogJyArIG1lc3NhZ2UsIHRpbWVvdXQpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IGdldFRhZ0ZpbGVzTWFwLCByYW5kb21FbGVtZW50IH0gZnJvbSAnLi91dGlsaXRpZXMnO1xuaW1wb3J0IHsgU21hcnRSYW5kb21Ob3RlU2V0dGluZ1RhYiB9IGZyb20gJy4vc2V0dGluZ1RhYic7XG5pbXBvcnQgeyBTZWFyY2hWaWV3LCBTbWFydFJhbmRvbU5vdGVTZXR0aW5ncyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT3BlblJhbmRvbVRhZ2dlZE5vdGVNb2RhbCB9IGZyb20gJy4vb3BlblJhbmRvbVRhZ2dlZE5vdGVNb2RhbCc7XG5pbXBvcnQgeyBTbWFydFJhbmRvbU5vdGVOb3RpY2UgfSBmcm9tICcuL3NtYXJ0UmFuZG9tTm90ZU5vdGljZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNtYXJ0UmFuZG9tTm90ZVBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gICAgc2V0dGluZ3M6IFNtYXJ0UmFuZG9tTm90ZVNldHRpbmdzID0geyBvcGVuSW5OZXdMZWFmOiB0cnVlLCBlbmFibGVSaWJib25JY29uOiB0cnVlIH07XG4gICAgcmliYm9uSWNvbkVsOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGFzeW5jIG9ubG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvYWRpbmcgc21hcnQtcmFuZG9tLW5vdGUnKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgU21hcnRSYW5kb21Ob3RlU2V0dGluZ1RhYih0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiAnb3Blbi1yYW5kb20tbm90ZScsXG4gICAgICAgICAgICBuYW1lOiAnT3BlbiBSYW5kb20gTm90ZScsXG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5oYW5kbGVPcGVuUmFuZG9tTm90ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiAnb3Blbi10YWdnZWQtcmFuZG9tLW5vdGUnLFxuICAgICAgICAgICAgbmFtZTogJ09wZW4gVGFnZ2VkIFJhbmRvbSBOb3RlJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmhhbmRsZU9wZW5UYWdnZWRSYW5kb21Ob3RlLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6ICdvcGVuLXJhbmRvbS1ub3RlLWZyb20tc2VhcmNoJyxcbiAgICAgICAgICAgIG5hbWU6ICdPcGVuIFJhbmRvbSBOb3RlIGZyb20gU2VhcmNoJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmhhbmRsZU9wZW5SYW5kb21Ob3RlRnJvbVNlYXJjaCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb251bmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1bmxvYWRpbmcgc21hcnQtcmFuZG9tLW5vdGUnKTtcbiAgICB9O1xuXG4gICAgaGFuZGxlT3BlblJhbmRvbU5vdGUgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtkb3duRmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XG5cbiAgICAgICAgY29uc3QgZmlsZVBhdGhzID0gbWFya2Rvd25GaWxlcy5tYXAoKHgpID0+IHgucGF0aCk7XG4gICAgICAgIHRoaXMub3BlblJhbmRvbU5vdGUoZmlsZVBhdGhzKTtcbiAgICB9O1xuXG4gICAgaGFuZGxlT3BlblRhZ2dlZFJhbmRvbU5vdGUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IHRhZ0ZpbGVzTWFwID0gZ2V0VGFnRmlsZXNNYXAodGhpcy5hcHApO1xuXG4gICAgICAgIGNvbnN0IHRhZ3MgPSBPYmplY3Qua2V5cyh0YWdGaWxlc01hcCk7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gbmV3IE9wZW5SYW5kb21UYWdnZWROb3RlTW9kYWwodGhpcy5hcHAsIHRhZ3MpO1xuXG4gICAgICAgIG1vZGFsLnN1Ym1pdENhbGxiYWNrID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFnZ2VkRmlsZXMgPSB0YWdGaWxlc01hcFttb2RhbC5zZWxlY3RlZFRhZ107XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm9wZW5SYW5kb21Ob3RlKHRhZ2dlZEZpbGVzKTtcbiAgICAgICAgfTtcblxuICAgICAgICBtb2RhbC5vcGVuKCk7XG4gICAgfTtcblxuICAgIGhhbmRsZU9wZW5SYW5kb21Ob3RlRnJvbVNlYXJjaCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgY29uc3Qgc2VhcmNoVmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3NlYXJjaCcpWzBdPy52aWV3IGFzIFNlYXJjaFZpZXc7XG5cbiAgICAgICAgaWYgKCFzZWFyY2hWaWV3KSB7XG4gICAgICAgICAgICBuZXcgU21hcnRSYW5kb21Ob3RlTm90aWNlKCdUaGUgY29yZSBzZWFyY2ggcGx1Z2luIGlzIG5vdCBlbmFibGVkJywgNTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gc2VhcmNoVmlldy5kb20ucmVzdWx0RG9tcy5tYXAoKHgpID0+IHguZmlsZS5iYXNlbmFtZSk7XG5cbiAgICAgICAgaWYgKCFzZWFyY2hSZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV3IFNtYXJ0UmFuZG9tTm90ZU5vdGljZSgnTm8gc2VhcmNoIHJlc3VsdHMgYXZhaWxhYmxlJywgNTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCB0aGlzLm9wZW5SYW5kb21Ob3RlKHNlYXJjaFJlc3VsdHMpO1xuICAgIH07XG5cbiAgICBvcGVuUmFuZG9tTm90ZSA9IGFzeW5jIChmaWxlUGF0aHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoVG9PcGVuID0gcmFuZG9tRWxlbWVudChmaWxlUGF0aHMpO1xuICAgICAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KGZpbGVQYXRoVG9PcGVuLCAnJywgdGhpcy5zZXR0aW5ncy5vcGVuSW5OZXdMZWFmLCB7IGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICB9O1xuXG4gICAgbG9hZFNldHRpbmdzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgICBjb25zdCBsb2FkZWRTZXR0aW5ncyA9IChhd2FpdCB0aGlzLmxvYWREYXRhKCkpIGFzIFNtYXJ0UmFuZG9tTm90ZVNldHRpbmdzO1xuICAgICAgICBpZiAobG9hZGVkU2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3BlbkluTmV3TGVhZihsb2FkZWRTZXR0aW5ncy5vcGVuSW5OZXdMZWFmKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RW5hYmxlUmliYm9uSWNvbihsb2FkZWRTZXR0aW5ncy5lbmFibGVSaWJib25JY29uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFJpYmJvbkljb24oKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzZXRPcGVuSW5OZXdMZWFmID0gKHZhbHVlOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Mub3BlbkluTmV3TGVhZiA9IHZhbHVlO1xuICAgICAgICB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgIH07XG5cbiAgICBzZXRFbmFibGVSaWJib25JY29uID0gKHZhbHVlOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuZW5hYmxlUmliYm9uSWNvbiA9IHZhbHVlO1xuICAgICAgICB0aGlzLnJlZnJlc2hSaWJib25JY29uKCk7XG4gICAgICAgIHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gICAgfTtcblxuICAgIHJlZnJlc2hSaWJib25JY29uID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnJpYmJvbkljb25FbD8ucmVtb3ZlKCk7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmVuYWJsZVJpYmJvbkljb24pIHtcbiAgICAgICAgICAgIHRoaXMucmliYm9uSWNvbkVsID0gdGhpcy5hZGRSaWJib25JY29uKFxuICAgICAgICAgICAgICAgICdkaWNlJyxcbiAgICAgICAgICAgICAgICAnT3BlbiBSYW5kb20gTm90ZSBmcm9tIFNlYXJjaCcsXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVPcGVuUmFuZG9tTm90ZUZyb21TZWFyY2gsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcbn1cbiJdLCJuYW1lcyI6WyJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiIsIkRyb3Bkb3duQ29tcG9uZW50IiwiQnV0dG9uQ29tcG9uZW50IiwiTW9kYWwiLCJOb3RpY2UiLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQXVDRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxD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
