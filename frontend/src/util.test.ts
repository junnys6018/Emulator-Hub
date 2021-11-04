import '@/tests/mocks/matchMedia';
import { toKebabCase } from './util';

test('toKebabCase()', () => {
    expect(toKebabCase('foo')).toBe('foo');
    expect(toKebabCase('hello-world')).toBe('hello-world');
    expect(toKebabCase('hello world')).toBe('hello-world');
    expect(toKebabCase('helloWorld')).toBe('hello-world');
    expect(toKebabCase('hello World')).toBe('hello-world');
});
