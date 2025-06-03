import { WrapFnPipe } from './wrap-fn.pipe';

describe('WrapFnPipe', () => {
  it('create an instance', () => {
    const pipe = new WrapFnPipe();
    expect(pipe).toBeTruthy();
  });
});
