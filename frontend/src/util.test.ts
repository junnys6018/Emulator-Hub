import '@/tests/mocks/matchMedia';
import { getExtension, stripExtension, toKebabCase } from './util';

test('toKebabCase()', () => {
    expect(toKebabCase('foo')).toBe('foo');
    expect(toKebabCase('hello-world')).toBe('hello-world');
    expect(toKebabCase('hello world')).toBe('hello-world');
    expect(toKebabCase('helloWorld')).toBe('hello-world');
    expect(toKebabCase('hello World')).toBe('hello-world');
});

test('stripExtension', () => {
    expect(stripExtension('foo.txt')).toBe('foo');
    expect(stripExtension('util.test.ts')).toBe('util.test');
    expect(stripExtension('hello world.pdf')).toBe('hello world');
    expect(stripExtension('file')).toBe('file');
});

test('getExtension', () => {
    expect(getExtension('foo.txt')).toBe('txt');
    expect(getExtension('util.test.ts')).toBe('ts');
    expect(getExtension('hello world.pdf')).toBe('pdf');
    expect(getExtension('file')).toBe(null);
});
