import { BurgistaTS2Page } from './app.po';

describe('burgista-ts2 App', function() {
  let page: BurgistaTS2Page;

  beforeEach(() => {
    page = new BurgistaTS2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
