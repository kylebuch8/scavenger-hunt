/*
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const yeoman_test_1 = require("yeoman-test");
const application_1 = require("../../init/application/application");
const run_command_1 = require("./run-command");
const element_1 = require("../../init/element/element");
const github_1 = require("../../init/github");
// A zero priveledge github token of a nonce account, used for quota.
const githubToken = '8d8622bf09bb1d85cb411b5e475a35e742a7ce35';
suite('integration tests', function () {
    const binPath = path.join(__dirname, '../../../', 'bin', 'polymer.js');
    // Extend timeout limit to 90 seconds for slower systems
    this.timeout(120000);
    suite('init templates', () => {
        // TODO(#562): enable test commands.
        test('test the Polymer 1.x application template', () => __awaiter(this, void 0, void 0, function* () {
            const dir = yield yeoman_test_1.run(application_1.createApplicationGenerator('polymer-1.x'))
                .withPrompts({ name: 'my-app' }) // Mock the prompt answers
                .toPromise();
            yield run_command_1.runCommand(binPath, ['install'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['lint'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['test'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['build'], { cwd: dir });
        }));
        test('test the Polymer 2.x application template', () => __awaiter(this, void 0, void 0, function* () {
            const dir = yield yeoman_test_1.run(application_1.createApplicationGenerator('polymer-2.x'))
                .withPrompts({ name: 'my-app' }) // Mock the prompt answers
                .toPromise();
            yield run_command_1.runCommand(binPath, ['install'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['lint'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['test'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['build'], { cwd: dir });
        }));
        test('test the Polymer 2.x "element" template', () => __awaiter(this, void 0, void 0, function* () {
            const dir = yield yeoman_test_1.run(element_1.createElementGenerator('polymer-2.x'))
                .withPrompts({ name: 'my-element' }) // Mock the prompt answers
                .toPromise();
            yield run_command_1.runCommand(binPath, ['install'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['lint'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['test'], { cwd: dir });
        }));
        test('test the Polymer 1.x "element" template', () => __awaiter(this, void 0, void 0, function* () {
            const dir = yield yeoman_test_1.run(element_1.createElementGenerator('polymer-1.x'))
                .withPrompts({ name: 'my-element' }) // Mock the prompt answers
                .toPromise();
            yield run_command_1.runCommand(binPath, ['install'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['lint'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['test'], { cwd: dir });
        }));
        test('test the "shop" template', () => __awaiter(this, void 0, void 0, function* () {
            const ShopGenerator = github_1.createGithubGenerator({
                owner: 'Polymer',
                repo: 'shop',
                githubToken,
            });
            const dir = yield yeoman_test_1.run(ShopGenerator).toPromise();
            yield run_command_1.runCommand(binPath, ['install'], { cwd: dir });
            // See: https://github.com/Polymer/shop/pull/114
            // await runCommand(
            //   binPath, ['lint', '--rules=polymer-2-hybrid'],
            //   {cwd: dir})
            // await runCommand(binPath, ['test'], {cwd: dir})
            yield run_command_1.runCommand(binPath, ['build'], { cwd: dir });
        }));
        // TODO(justinfagnani): consider removing these integration tests
        // or checking in the contents so that we're not subject to the
        // other repo changing
        test.skip('test the Polymer 1.x "starter-kit" template', () => __awaiter(this, void 0, void 0, function* () {
            const PSKGenerator = github_1.createGithubGenerator({
                owner: 'PolymerElements',
                repo: 'polymer-starter-kit',
                semverRange: '^2.0.0',
                githubToken,
            });
            const dir = yield yeoman_test_1.run(PSKGenerator).toPromise();
            yield run_command_1.runCommand(binPath, ['install'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['lint', '--rules=polymer-2-hybrid'], { cwd: dir });
            // await runCommand(binPath, ['test'], {cwd: dir})
            yield run_command_1.runCommand(binPath, ['build'], { cwd: dir });
        }));
        // TODO(justinfagnani): consider removing these integration tests
        // or checking in the contents so that we're not subject to the
        // other repo changing
        test.skip('test the Polymer 2.x "starter-kit" template', () => __awaiter(this, void 0, void 0, function* () {
            const PSKGenerator = github_1.createGithubGenerator({
                owner: 'PolymerElements',
                repo: 'polymer-starter-kit',
                semverRange: '^3.0.0',
                githubToken,
            });
            const dir = yield yeoman_test_1.run(PSKGenerator).toPromise();
            yield run_command_1.runCommand(binPath, ['install'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['lint', '--rules=polymer-2'], { cwd: dir });
            // await runCommand(binPath, ['test'], {cwd: dir}));
            yield run_command_1.runCommand(binPath, ['build'], { cwd: dir });
        }));
    });
    // TODO(justinfagnani): consider removing these integration tests
    // or checking in the contents so that we're not subject to the
    // other repo changing
    suite.skip('tools-sample-projects templates', () => {
        let tspDir;
        suiteSetup(() => __awaiter(this, void 0, void 0, function* () {
            const TSPGenerator = github_1.createGithubGenerator({
                owner: 'Polymer',
                repo: 'tools-sample-projects',
                githubToken,
            });
            tspDir = yield yeoman_test_1.run(TSPGenerator).toPromise();
        }));
        test('test the "polymer-1-app" template', () => __awaiter(this, void 0, void 0, function* () {
            const dir = path.join(tspDir, 'polymer-1-app');
            yield run_command_1.runCommand(binPath, ['install'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['lint'], { cwd: dir });
            // await runCommand(binPath, ['test'], {cwd: dir});
            yield run_command_1.runCommand(binPath, ['build'], { cwd: dir });
        }));
        test('test the "polymer-2-app" template', () => __awaiter(this, void 0, void 0, function* () {
            const dir = path.join(tspDir, 'polymer-2-app');
            yield run_command_1.runCommand(binPath, ['install'], { cwd: dir });
            yield run_command_1.runCommand(binPath, ['lint'], { cwd: dir });
            // await runCommand(binPath, ['test'], {cwd: dir})
            yield run_command_1.runCommand(binPath, ['build'], { cwd: dir });
        }));
    });
});
