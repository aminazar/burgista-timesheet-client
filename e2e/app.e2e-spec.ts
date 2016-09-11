import { BergistaTSPage } from './app.po';

describe('bergista-ts App', function() {
  let page: BergistaTSPage;

  beforeEach(() => {
    page = new BergistaTSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
