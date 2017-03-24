/* global utils */
const plugin = require('./posthtml-rename-id');

const t = utils.setupPluginTest(plugin);

const pattern = 'test_[id]';

describe('Pattern', () => {
  it('default (does nothing)', () => {
    return t(
      undefined,
      '<svg><path id="a" /></svg>',
      '<svg><path id="a" /></svg>'
    );
  });

  it('string', () => {
    return t(
      { pattern: 'b' },
      '<svg><path id="a" /></svg>',
      '<svg><path id="b" /></svg>'
    );
  });

  it('[id] placeholder', () => {
    return t(
      { pattern: 'test_[id]' },
      '<svg><path id="a" /></svg>',
      '<svg><path id="test_a" /></svg>'
    );
  });

  it('function', () => {
    return t(
      { pattern: id => id.toUpperCase() },
      '<svg><path id="aaa" /></svg>',
      '<svg><path id="AAA" /></svg>'
    );
  });

  it('function with placeholder in returned value', () => {
    return t(
      { pattern: () => 'qwe_[id]_[id]' },
      '<svg><path id="aaa" /></svg>',
      '<svg><path id="qwe_aaa_aaa" /></svg>'
    );
  });
});

describe('Processing', () => {
  it('should not modify nodes without id', () => {
    return t(
      { pattern },
      '<svg><path /></svg>',
      '<svg><path /></svg>'
    );
  });

  it('should modify any attribute value which contains `url(#id)`', () => {
    return t(
      { pattern },
      '<svg><linearGradient id="gradient"><stop stop-color="red" /></linearGradient><path fill="url(#gradient)" /></svg>',
      '<svg><linearGradient id="test_gradient"><stop stop-color="red" /></linearGradient><path fill="url(#test_gradient)" /></svg>'
    );
  });

  it('should not modify attribute value which contains `url(#id)` when correspondent id not found', () => {
    return t(
      { pattern },
      '<svg><linearGradient><stop stop-color="red" /></linearGradient><path fill="url(#gradient)" /></svg>',
      '<svg><linearGradient><stop stop-color="red" /></linearGradient><path fill="url(#gradient)" /></svg>'
    );
  });

  it('should modify `link/xlink:href` attribute', () => {
    return t(
      { pattern },
      '<svg><path id="path" /><use xlink:href="#path" href="#path" /></svg>',
      '<svg><path id="test_path" /><use xlink:href="#test_path" href="#test_path" /></svg>'
    );
  });

  it('should not modify `link/xlink:href` attribute when correspondent id not found', () => {
    return t(
      { pattern },
      '<svg><path /><use xlink:href="#path" href="#path" /></svg>',
      '<svg><path /><use xlink:href="#path" href="#path" /></svg>'
    );
  });

  it('should modify style declarations', () => {
    return t(
      { pattern },
      '<svg><path id="ref" /><path style="fill: url(#ref); background-image: url(#ref) ; " /></svg>',
      '<svg><path id="test_ref" /><path style="fill: url(#test_ref); background-image: url(#test_ref) ; " /></svg>'
    );
  });

  it('should not modify style declarations when correspondent id not found', () => {
    return t(
      { pattern },
      '<svg><path /><path style="fill: url(#ref); background-image: url(#ref) ; " /></svg>',
      '<svg><path /><path style="fill: url(#ref); background-image: url(#ref) ; " /></svg>'
    );
  });

  it('should modify style declarations in `style` tag', () => {
    return t(
      { pattern },
      '<svg><defs><style>.a {fill: url(#ref);}</style></defs><path id="ref" /><path fill="url(#ref)" /></svg>',
      '<svg><defs><style>.a {fill: url(#test_ref);}</style></defs><path id="test_ref" /><path fill="url(#test_ref)" /></svg>'
    );
  });

  it('should not modify style declarations in `style` tag when correspondent id not found', () => {
    return t(
      { pattern },
      '<svg><defs><style>.a {fill: url(#ref);}</style></defs><path /><path fill="url(#ref)" /></svg>',
      '<svg><defs><style>.a {fill: url(#ref);}</style></defs><path /><path fill="url(#ref)" /></svg>'
    );
  });
});
