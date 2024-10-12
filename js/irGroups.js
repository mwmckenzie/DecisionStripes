
function CreateNode(level = 0, threshold = false){
    return { 
        id: GenerateID(), 
        level: level,
        threshold: threshold, 
        size: 1,
        displayName: "1",
        children: [] 
    };
}

function GenerateID(){
    return Math.random().toString(36).substr(2, 9);
}

function CreateRootNode() {
    return CreateNode();
}

function IsRootNode(node){
    return node.level === 0;
}

function GetSequenceNum(node){
    if (node.level < 0){
        return -1;
    }
    if (node.level === 0){
        return 0;
    }
    const children = node.parent.children;
    for (let i = 0; i < children.length; i++){
        if (children[i].id === node.id){
            return i;
        }
    }
    return -1;
}


function GetParentNode(rootNode, level, sequenceNum){
    
}


function GenerateIrGroup(levels = 2, maxChildCount = 3, thresholdAvg = 0.8){
    
    let rootNode = CreateRootNode();
    
    rootNode = GenerateIrNode(rootNode,  maxChildCount);
    
    function GenerateIrNode(rootNode, maxChildCount) {
        
        const childCount = Math.floor(Math.random() * maxChildCount + 1) * (rootNode.level + 2);
        
        for (let i = 0; i < childCount; i++){
            const childLevel = rootNode.level + 1;
            
            let childNode = CreateNode(childLevel);
            childNode.displayName = rootNode.displayName + "." + (i + 1);
            if (childLevel < levels){
                childNode = GenerateIrNode(childNode, maxChildCount);
            }
            else {
                childNode.threshold = Math.random() < thresholdAvg;
            }
            rootNode.children.push(childNode);
        }
        return rootNode;
    }
    
    return rootNode;
}

function CollapseIrGroup(rootNode){

    function CollapseChildren(rootNode) {
        if (rootNode.children.length <= 0){
            return rootNode;
        }
        
        rootNode.threshold = true;
        let aggregateSize = 0;
        
        for (let i = 0; i < rootNode.children.length; i++){
            const child = CollapseChildren(rootNode.children[i]);
            aggregateSize += child.size;
            if (!child.threshold){
                rootNode.threshold = false;
            }
            rootNode.children[i] = child;
        }
        
        if (rootNode.threshold) {
            rootNode.size = aggregateSize;
            rootNode.children = [];
        }
        
        return rootNode;
    }

    return CollapseChildren(rootNode);
}

function collapsedGroupToPlotList(rootNode){
    let plotList = [];
    
    function PutLeavesInPlotList(node) {
        if (node.children.length <= 0){
            plotList.push(node);
        }
        else{
            for (let i = 0; i < node.children.length; i++){
                PutLeavesInPlotList(node.children[i]);
            }
        }
    }

    PutLeavesInPlotList(rootNode);
    return plotList;
}

function GetTotalSize(nodeList){
    let totalSize = 0;
    nodeList.forEach(node => {
        totalSize += node.size;
    });
    return totalSize;
}

function Debug(obj, name){
    const objStr = JSON.stringify(obj);
    console.log(objStr);
    localStorage.setItem(name, objStr);
}