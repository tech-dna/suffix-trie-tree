export function buildTree(entries) {

}

export default class Ukonnens {
  constructor(text){
    this.activeLength = 0;
    this.activeNode;
    this.activeEdge;
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
    this.toString = this.toString.bind(this);

    this.root = this.createNode(-1);
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
  }

  build(string) {
    if (string) this.text = string;
    // if (!this.activeNode) this.activeNode = this.root;

    this.activeNode = this.getActiveNode();
    this.startPhase();
    if (this.activeLength > 0) {
      const nextChar = this.getPhaseChar();
      const nextCharInActiveNode = this.getNodeNextChar();
      if (nextChar === nextCharInActiveNode) {
        this.activeLength++;
        return this.build();
      }
      else {
        this.split(this.activeNode, this.activeLength, nextChar, this.phase);
        this.activeNode.suffixLink = this.root;
        this.remaining--;
        this.activeEdgePos++;
        this.activeLength--;
        return this.build();
        // return;
      }
    }
    while(this.remaining > 0) {
      if (!this.pathExistsFrom(this.activeNode, this.getPhaseChar())) {
        if (!this.getPhaseChar()) return;
        this.activeNode.edges.set(this.getPhaseChar()
          , this.createNode(this.phase, () => this.end));

        this.remaining--;
      }
      else {
        this.activeEdgePos = this.getEdgePos(this.activeNode.edges.get(this.getPhaseChar()));
        this.activeLength++;
        break;
      }
    }
    // this.startPhase();
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

  getActivePoint() {
    if (!this.activeNode) return;
    // active point is position base 1 (not 0)
    return this.text[this.activeEdgePos + this.activeLength - 1];
  }

  getActiveNode(forceWalk = false) {
    if (this.activeEdgePos < 0) return this.root;

    const text = this.text[this.activeEdgePos];
    const node = this.root.edges.get(text);
    const currentText = this.text[node.getLeftInd + this.activeLength];

    return node.edges.get(currentText)
      || node;
  }

  getNextCharacter() {
    return this.text[this.phase + 1];
  }

  startPhase(i = 0) {
    // console.log('starting phase', this.end, this.remaining, this.phase);
    this.end++;
    this.remaining++;
    this.phase++;
  }
  takePath() {
    this.activeEdge++;
    this.activeLength++;
  }
  tostring(currentNode = this.root) {
    let content = '';
    for (const [key, value] of currentNode.edges) {
      content += key + this.tostring(value);
    }
    return content;
  }
  createNode(getLeftInd, getRightInd) {
    const rightIndex = 0;

    console.log('rcreated node for', this.text[getLeftInd]);
    // getLeftInd is not zero indexed
    return {
      edges: new Map(),
      getLeftInd,
      getRightInd: getRightInd || function(){ return rightIndex; },
      suffixLink: void 0
    };
  }
}
