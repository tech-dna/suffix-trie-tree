export function buildTree(entries) {

}

export default class Ukonnens {
  constructor(text){
    this.activeLength = 0;
    this.activeEdge = void 0;
    this.activeEdgePos = -1;
    this.remaining = 0;
    this.end = -1;
    this.text = text;
    this.phase = -1;
    this.build = this.build.bind(this);
    this.startPhase = this.startPhase.bind(this);
    this.createNode = this.createNode.bind(this);
    this.getActivePoint = this.getActivePoint.bind(this);
    this.getNextCharacter = this.getNextCharacter.bind(this);
    this.getActiveNode = this.getActiveNode.bind(this);
    this.getPhaseChar = this.getPhaseChar.bind(this);
    this.getPhaseCharPos = this.getPhaseCharPos.bind(this);
    this.pathExistsFrom = this.pathExistsFrom.bind(this);
    this.getActiveEdge = this.getActiveEdge.bind(this);
    this.getEdgePos = this.getEdgePos.bind(this);
    this.getNodeNextChar = this.getNodeNextChar.bind(this);
    this.split = this.split.bind(this);
    this.getNodeCharAt = this.getNodeCharAt.bind(this);
    this.walkInnerNode = this.walkInnerNode.bind(this);
    this.toString = this.toString.bind(this);

    this.root = this.createNode(-1);
    this.activeNode = this.root;
  }

  pathExistsFrom(node, letter) {
    return node.edges.has(letter);
  }

  getActiveEdge() {
    if (this.activeEdgePos < 0) return;
    return this.text[this.activeEdgePos];
  }

  getEdgePos(node) {
    return node.getLeftInd;
  }

  getNodeNextChar() {
    const currentNode = this.getActiveNode();
    const indexCoveredByNode = currentNode.getLeftInd + this.activeLength;
    return this.text[indexCoveredByNode];
  }

  getNodeCharAt(node, pos) {
    return this.text[node.getLeftInd + pos];
  }

  split(node, position, newPathKey, newLeftIndex) {
    if(!newPathKey) return;
    const pathFromOldBranch = this.createNode(node.getLeftInd + position, () => this.end);
    node.edges.set(this.getNodeCharAt(node, position), pathFromOldBranch);
    node.edges.set(newPathKey, this.createNode(newLeftIndex, () => this.end));

    // this.activeLength is not zero based
    const newRight = (node.getLeftInd + this.activeLength) - 1;
    node.getRightInd = () => newRight;
    node.suffixLink = this.root;
    this.remaining--;
  }

  walkInnerNode(prevNewNode) {
    if (this.activeLength <= 0) return;
    const nextChar = this.getPhaseChar();
    const nextCharInActiveNode = this.getNodeNextChar();
    const nodeFromPos = this.getActiveNode();
    if (nextChar === nextCharInActiveNode) {
      //rule 3 extension
      this.activeLength++;
      return this.build();
    }
    else {
      this.split(nodeFromPos, this.activeLength, nextChar, this.phase);
      // this.activeNode.suffixLink = this.root;
      // this.remaining++;
      if (prevNewNode) {
        prevNewNode.suffixLink = nodeFromPos;
      }
      this.activeEdgePos++;
      this.activeLength--;
      const oldActiveNode = nodeFromPos;
      // this.activeNode = this.getActiveNode();
      const nextChar2 = this.getNextCharacter();
      const nextCharInActiveNode2 = this.getNodeNextChar();
      if (nextChar2 != nextCharInActiveNode2) {
        this.walkInnerNode(oldActiveNode);
      }
      // you looped through to the end
      // if (this.phase + 1 >= this.text.length) this.remaining = 0;
    }
  }

  build(string) {
    if (string) this.text = string;

    const nodeFromActiveNode = this.getActiveNode();
    this.startPhase();
    this.walkInnerNode();
    // if (this.phase + 1 > this.text.length) return;
    while(this.remaining > 0) {
      const currentPhaseChar = this.getPhaseChar();
      if (!this.pathExistsFrom(nodeFromActiveNode, currentPhaseChar)) {
        // rule 2 extension
        if (currentPhaseChar) {
          nodeFromActiveNode.edges.set(currentPhaseChar
            , this.createNode(this.phase, () => this.end));
        }

        this.remaining--;
      }
      else {
        this.activeEdgePos = this.getEdgePos(nodeFromActiveNode.edges.get(currentPhaseChar));
        this.activeLength++;
        break;
      }
    }
    if (this.phase + 1 < this.text.length) this.build();
  }

  getPhaseCharPos() {
    return this.phase;
  }

  getPhaseChar() {
    return this.text[this.getPhaseCharPos()];
  }

  getNodeText(node) {
    return this.text.substring(node.getLeftInd, node.getRightInd() + 1);
  }

  getActivePoint(fromNode = this.activeNode) {
    if (!fromNode) return;
    // active point is position base 1 (not 0)
    return this.text[this.activeEdgePos + this.activeLength - 1];
  }

  getActiveNode() {
    if (this.activeEdgePos < 0) return this.root;
    if (this.activeLength === 0) return this.root;

    const text = this.text[this.activeEdgePos];
    const node = this.root.edges.get(text);
    if (!node) return this.root;
    const currentText = this.text[node.getLeftInd + this.activeLength];

    return node.edges.get(currentText)
      || node;
  }

  getNextCharacter() {
    return this.text[this.phase + 1];
  }

  startPhase() {
    this.end++;
    this.remaining++;
    this.phase++;
  }
  createNode(getLeftInd, getRightInd) {
    const rightIndex = 0;

    // getLeftInd is not zero indexed
    return {
      edges: new Map(),
      getLeftInd,
      getRightInd: getRightInd || function(){ return rightIndex; },
      suffixLink: void 0
    };
  }
}
