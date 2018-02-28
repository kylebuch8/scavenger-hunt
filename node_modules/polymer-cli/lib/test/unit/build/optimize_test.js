"use strict";
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const vfs = require("vinyl-fs-fake");
const optimize_streams_1 = require("../../../build/optimize-streams");
const streams_1 = require("../../../build/streams");
suite('optimize-streams', () => {
    function testStream(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                stream.on('data', resolve);
                stream.on('error', reject);
            });
        });
    }
    test('compile js', () => __awaiter(this, void 0, void 0, function* () {
        const expected = `var apple = 'apple';var banana = 'banana';`;
        const sourceStream = vfs.src([
            {
                path: 'foo.js',
                contents: `const apple = 'apple'; let banana = 'banana';`,
            },
        ]);
        const op = streams_1.pipeStreams([sourceStream, optimize_streams_1.getOptimizeStreams({ js: { compile: true } })]);
        const f = yield testStream(op);
        chai_1.assert.equal(f.contents.toString(), expected);
    }));
    test('does not compile webcomponents.js files (windows)', () => __awaiter(this, void 0, void 0, function* () {
        const es6Contents = `const apple = 'apple';`;
        const sourceStream = vfs.src([
            {
                path: 'A:\\project\\bower_components\\webcomponentsjs\\webcomponents-es5-loader.js',
                contents: es6Contents,
            },
        ]);
        const op = streams_1.pipeStreams([sourceStream, optimize_streams_1.getOptimizeStreams({ js: { compile: true } })]);
        const f = yield testStream(op);
        chai_1.assert.equal(f.contents.toString(), es6Contents);
    }));
    test('does not compile webcomponents.js files (unix)', () => __awaiter(this, void 0, void 0, function* () {
        const es6Contents = `const apple = 'apple';`;
        const sourceStream = vfs.src([
            {
                path: '/project/bower_components/webcomponentsjs/webcomponents-es5-loader.js',
                contents: es6Contents,
            },
        ]);
        const op = streams_1.pipeStreams([sourceStream, optimize_streams_1.getOptimizeStreams({ js: { compile: true } })]);
        const f = yield testStream(op);
        chai_1.assert.equal(f.contents.toString(), es6Contents);
    }));
    test('minify js', () => __awaiter(this, void 0, void 0, function* () {
        const sourceStream = vfs.src([
            {
                path: 'foo.js',
                contents: 'var foo = 3',
            },
        ]);
        const op = streams_1.pipeStreams([sourceStream, optimize_streams_1.getOptimizeStreams({ js: { minify: true } })]);
        const f = yield testStream(op);
        chai_1.assert.equal(f.contents.toString(), 'var foo=3;');
    }));
    test('minify js (es6)', () => __awaiter(this, void 0, void 0, function* () {
        const sourceStream = vfs.src([
            {
                path: 'foo.js',
                contents: '[1,2,3].map(n => n + 1);',
            },
        ]);
        const op = streams_1.pipeStreams([sourceStream, optimize_streams_1.getOptimizeStreams({ js: { minify: true } })]);
        const f = yield testStream(op);
        chai_1.assert.equal(f.contents.toString(), '[1,2,3].map((a)=>a+1);');
    }));
    test('minify html', () => __awaiter(this, void 0, void 0, function* () {
        const expected = `<!doctype html><style>foo {
            background: blue;
          }</style><script>document.registerElement(\'x-foo\', XFoo);</script><x-foo>bar</x-foo>`;
        const sourceStream = vfs.src([
            {
                path: 'foo.html',
                contents: `
        <!doctype html>
        <style>
          foo {
            background: blue;
          }
        </style>
        <script>
          document.registerElement('x-foo', XFoo);
        </script>
        <x-foo>
          bar
        </x-foo>
        `,
            },
        ], { cwdbase: true });
        const op = streams_1.pipeStreams([sourceStream, optimize_streams_1.getOptimizeStreams({ html: { minify: true } })]);
        const f = yield testStream(op);
        chai_1.assert.equal(f.contents.toString(), expected);
    }));
    test('minify css', () => __awaiter(this, void 0, void 0, function* () {
        const sourceStream = vfs.src([
            {
                path: 'foo.css',
                contents: '/* comment */ selector { property: value; }',
            },
        ]);
        const op = streams_1.pipeStreams([sourceStream, optimize_streams_1.getOptimizeStreams({ css: { minify: true } })]);
        const f = yield testStream(op);
        chai_1.assert.equal(f.contents.toString(), 'selector{property:value;}');
    }));
    test('minify css (inlined)', () => __awaiter(this, void 0, void 0, function* () {
        const expected = `<style>foo{background:blue;}</style>`;
        const sourceStream = vfs.src([
            {
                path: 'foo.html',
                contents: `
          <!doctype html>
          <html>
            <head>
              <style>
                foo {
                  background: blue;
                }
              </style>
            </head>
            <body></body>
          </html>
        `,
            },
        ], { cwdbase: true });
        const op = streams_1.pipeStreams([sourceStream, optimize_streams_1.getOptimizeStreams({ css: { minify: true } })]);
        const f = yield testStream(op);
        chai_1.assert.include(f.contents.toString(), expected);
    }));
});
