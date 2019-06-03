import { expect } from 'chai';

describe.only('Searchbox utility', () => {
  const sutImport = require('./').default;
  let Sut2;
  beforeEach(() => {
    Sut2 = new sutImport('test');
  });
/*
  /!*it.only('should increment remaining and end on phase start', () => {
    Sut.startPhase();
    expect(Sut.remaining).to.equal(1);
    expect(Sut.end).to.equal(0);
  });*!/
  it('should return expected structure given simple input', () => {
    const Sut = new sutImport('test');
    Sut.build('abc');
    expect(Sut.tostring()).to.equal('abc');
    expect(Sut.root.edges.size).to.equal(3);
    expect(Sut.root.edges.get('b').getLeftInd).to.equal(2);
    expect(Sut.root.edges.get('c').getLeftInd).to.equal(3);
  });
  it('should correctly handle duplicates', () => {
    const Sut = new sutImport('test');
    Sut.build('abca');
    expect(Sut.tostring()).to.equal('abc');
    expect(Sut.root.edges.size).to.equal(3);
    expect(Sut.getNodeText(Sut.root.edges.get('c'))).to.equal('ca');
  });
  it.only('should correctly handle duplicates2', () => {
    const Sut = new sutImport('test');
    Sut.build('abcabd');
    // expect(Sut.root.edges.size).to.equal(4);
    expect(Sut.root.edges.has('d')).to.be.true;
    expect(Sut.getNodeText(Sut.root.edges.get('c'))).to.equal('cabd');
  });
  it('should not create a new node when path exists', () => {
    Sut.build('abcba');
    expect(Sut.root.edges.size).to.equal(3);
    expect(Sut.root.edges.get('b').size).to.equal(1);
  });
  it('should get accurate active point', () => {
    Sut.build('abcabd');
    Sut.activeEdge = 'b';
    Sut.activeLength = 2;

    const result = Sut.getActivePoint();

    expect(Sut.root).to.deep.equal(Sut.activeNode);
    expect(result).to.equal('a');
    //expect(Sut.tostring(Sut.getActiveNode())).to.equal('abd');
  });
  it('should set active point to undefined when starting', () => {
    Sut.activeEdge = void 0;
    Sut.activeLength = 0;
    Sut.activeNode = void 0;

    const result = Sut.getActivePoint();

    expect(result).to.be.undefined;
    expect(Sut.getActiveNode()).to.be.undefined;
  });
*/

  it('should return accurately if path exists from node to letter', () => {
    const Sut = new sutImport('xyzxyaxyz$');
    Sut.root.edges.clear();
    Sut.root.edges.set('e', {});
    expect(Sut.pathExistsFrom(Sut.root, 'e')).to.be.true;
    expect(Sut.pathExistsFrom(Sut.root, 'f')).to.be.false;
  });

  it('should return undefined activeedge when activeedge pos is 0', () => {
    const Sut = new sutImport('xyzxyaxyz$');
    expect(Sut.getActiveEdge()).to.be.undefined;
  });

  it('should return activeedge char when activeedge pos is valid', () => {
    const Sut = new sutImport('xyzxyaxyz$');
    Sut.activeEdgePos = 2;
    expect(Sut.getActiveEdge()).to.equal('z');
  });

  it('should return valid indices', () => {
    const Sut = new sutImport('xyz');
    Sut.build();
    const firstEdge = Sut.root.edges.get('x');
    const secondEdge = Sut.root.edges.get('y');
    const thirdEdge = Sut.root.edges.get('z');

    expect(firstEdge).to.not.be.undefined;
    expect(secondEdge).to.not.be.undefined;
    expect(thirdEdge).to.not.be.undefined;
    expect(firstEdge).to.have.property('getLeftInd')
      .to.equal(0);
    expect(secondEdge).to.have.property('getLeftInd')
      .to.equal(1);
    expect(thirdEdge).to.have.property('getLeftInd')
      .to.equal(2);
    expect(firstEdge.getRightInd()).to.equal(2);
    expect(secondEdge.getRightInd()).to.equal(2);
    expect(thirdEdge.getRightInd()).to.equal(2);
  });

  it('should return valid index of found node', () => {
    const Sut = new sutImport('xyzz');
    Sut.build();

    const result = Sut.getEdgePos(Sut.root.edges.get('z'));
    expect(result).to.equal(2);
  });

  it('should return valid node text', () => {
    const Sut = new sutImport('xyzx');
    Sut.build();

    expect(Sut.getNodeText(Sut.root.edges.get('y'))).to.equal('yzx');
    expect(Sut.getNodeText(Sut.root.edges.get('x'))).to.equal('xyzx');
    expect(Sut.getNodeText(Sut.root.edges.get('z'))).to.equal('zx');
  });

  it('should return valid edges when duplicate exists', () => {
    const Sut = new sutImport('xyzxy');
    Sut.build();

    const firstEdge = Sut.root.edges.get('x');
    const secondEdge = Sut.root.edges.get('y');
    const thirdEdge = Sut.root.edges.get('z');

    console.log('teeeest', Sut.root);
    expect(Sut.root.edges.size).to.be.equal(3);
    expect(Sut.getNodeText(firstEdge)).to.equal('xyzxy');
    expect(Sut.getNodeText(secondEdge)).to.equal('yzxy');
    expect(Sut.getNodeText(thirdEdge)).to.equal('zxy');
  });

  it('should return accurate active point', () => {
    const Sut = new sutImport('xyzxy');
    Sut.build();
    Sut.activeEdgePos = 1; // y
    Sut.activeLength = 2;

    const activePoint  = Sut.getActivePoint();

    expect(activePoint).to.be.equal('z');
  });

  it('should return accurate active node', () => {
    const Sut = new sutImport('xyzxy');
    Sut.build();
    Sut.activeEdgePos = 1; // y
    Sut.activeLength = 2;

    const expected = Sut.root.edges.get('y');
    const activeNode  = Sut.getActiveNode();

    expect(activeNode.getLeftInd).to.be.equal(expected.getLeftInd);
    expect(activeNode.getRightInd()).to.be.equal(expected.getRightInd());
    expect(Sut.getNodeText(activeNode)).to.be.equal(Sut.getNodeText(expected));
  });

  it('should return accurate active node 2', () => {
    const Sut = new sutImport('xyzxy');
    Sut.build();
    Sut.activeEdgePos = 1; // y
    Sut.activeLength = 2;

    const expected = Sut.root.edges.get('y');
    const activeNode  = Sut.getActiveNode();

    expect(activeNode.getLeftInd).to.be.equal(expected.getLeftInd);
    expect(activeNode.getRightInd()).to.be.equal(expected.getRightInd());
    expect(Sut.getNodeText(activeNode)).to.be.equal(Sut.getNodeText(expected));
  });

  it('should accurately walk active node', () => {
    const Sut = new sutImport('xyzxy');
    Sut.build();
    Sut.activeEdgePos = 0; // x
    Sut.activeLength = 2; // y [1]
    Sut.activeNode = Sut.root;

    const expected = Sut.root.edges.get('x');
    const activeNode  = Sut.getActiveNode(true);

    expect(activeNode.getLeftInd).to.be.equal(expected.getLeftInd);
    // expect(activeNode.getRightInd()).to.be.equal(expected.getRightInd());
    expect(Sut.getNodeText(activeNode)).to.be.equal(Sut.getNodeText(expected));
  });

  it('should return accurate next character given an active node', () => {
    const Sut = new sutImport('xyzxy');
    Sut.build();
    Sut.activeEdgePos = 1; // y
    Sut.activeLength = 2;

    const result = Sut.getNodeNextChar();
    expect(result).to.equal('x');
  });

  it('should accurately get nodeCharAt', () => {
    const Sut = new sutImport('xyzxy');
    Sut.build();

    expect(Sut.getNodeCharAt(Sut.root.edges.get('x'), 3), 'z');
    expect(Sut.getNodeCharAt(Sut.root.edges.get('y'), 3), 'x');
  });

  it('should split node correctly', () => {
    const Sut = new sutImport('xyzxy');
    Sut.build();
    const node = Sut.root.edges.get('x');
    Sut.activeLength = 2;

    Sut.split(node, 2, 'v', 5);

    expect(node.edges.size).to.equal(2);
    expect(node.getRightInd()).to.equal(1);
    expect(node.edges.has('z')).to.be.true;
    expect(node.edges.get('z').getLeftInd).to.equal(2);
    expect(node.edges.get('z').getRightInd()).to.equal(5);
    expect(node.edges.has('v')).to.be.true;
    expect(node.edges.get('v').getLeftInd).to.equal(5);
    expect(node.edges.get('v').getRightInd()).to.equal(5);
  });

  it.only('should break node at next different character', () => {
    const Sut = new sutImport('xyzxya');
    Sut.build();

    console.log('suff', Sut.root.edges.get('x').suffixLink);
    expect(Sut.root.edges.get('x').edges.size).to.equal(2);
    expect(Sut.root.edges.get('x').getRightInd()).to.equal(1);
    expect(Sut.root.edges.get('x').getLeftInd).to.equal(0);
    expect(Sut.root.edges.get('x').edges.get('z').getLeftInd).to.equal(2);
    expect(Sut.root.edges.get('x').edges.get('a').getLeftInd).to.equal(5);
    expect(Sut.root.edges.get('y').edges.size).to.equal(2);
    expect(Sut.root.edges.get('z').edges.size).to.equal(0);
  });

  it('should point internal node to root', () => {
    const Sut = new sutImport('xyzxya');
    Sut.build();

    expect(Sut.root.edges.get('x').suffixLink).to.deep.equal(Sut.root);
  });
});