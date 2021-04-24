var height = 500;
var width = 500;
var nodes = [
  {value:"66666666",type:"home",index:"0"},
  {value:"11111111111",type:"phone",index:"1"},
  {value:"22222222222",type:"phone",index:"2"},
  {value:"33333333333",type:"phone",index:"3"},
  {value:"44444444444",type:"phone",index:"4"},
  {value:"55555555555",type:"phone",index:"5"},
  {value:"aaa",type:"weixin",index:"6"},
  {value:"bbb",type:"weixin",index:"7"},
  {value:"ccc",type:"weixin",index:"8"},
  {value:"ddd",type:"weixin",index:"9"},
  {value:"eee",type:"weixin",index:"10"},
  {value:"fff",type:"weixin",index:"11"},
];
var links = [
  {source:0,target:1},
  {source:0,target:2},
  {source:0,target:3},
  {source:0,target:4},
  {source:0,target:5},
  {source:2,target:6},
  {source:2,target:7},
  {source:2,target:8},
  {source:3,target:9},
  {source:3,target:10},
  {source:3,target:11},
]
var svg = d3.select("#forceMap").append("svg")
						.attr("width",width)
            .attr("height",height)
            .attr("id","forceSvg");
var mapG = svg.append("g")
.attr("id","forceGroup");

var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .size([width,height])
                    .linkDistance(100)
                    .charge([-1250])
                    .gravity(0.5)
                    .friction(0.5);
force.start();
var linkG = mapG.selectAll(".link")
.data(links)
.enter()
.append("line")
.attr("class","link")
.attr("stroke","#ccc");
var nodeG = mapG.selectAll(".node")
.data(nodes)
.enter()
.append("circle")
.attr("class","node")
.attr("r",8)
.attr("fill",function(d){
  switch(d.type){
    case "home": return "red";break;
    case"phone": return "blue";break;
    case "weixin": return "green";break;
  }
});


force.on("tick", function () {
  									linkG.attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });


                nodeG.attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function(d){
                  return d.y
                });
});

function drawTree(){
  var middleData = {};
  var linksBak = links.concat();
  var nodesBak = nodes.concat();
  nodesBak.forEach(function(d){
            if(d.index == 0){
                var temp = {
                    name:d.index,
                    children:[]
                };
                var treeData = toTreeData(linksBak);
                function toTreeData(data){
                    var pos={};
                    var tree=[];
                    var i=0;
                    while(data.length!=0){
                        if(data[i].source.index==d.index){
                            tree.push({
                                name:data[i].target.index,
                                children:[]
                            });
                            pos[data[i].target.index]=[tree.length-1];
                            data.splice(i,1);
                            i--;
                        }else{
                            var posArr=pos[data[i].source.index];
                            if(posArr!=undefined){

                                var obj=tree[posArr[0]];
                                for(var j=1;j<posArr.length;j++){
                                    obj=obj.children[posArr[j]];
                                }

                                obj.children.push({
                                    name:data[i].target.index,
                                    children:[]
                                });
                                pos[data[i].target.index]=posArr.concat([obj.children.length-1]);
                                data.splice(i,1);
                                i--;
                            }
                        }
                        i++;
                        if(i>data.length-1){
                            i=0;
                        }
                    }
                    return tree;
                }
                temp.children = treeData;
                middleData = temp;
            }
        });
  
  var tree = d3.layout.tree()
            .size([450,450]);
  var tempNodes = tree.nodes(middleData);
  force.start();
  force.on("tick",function(){
    tempNodes.forEach(function(d,i){
    nodes[d.name].x = d.x;
    nodes[d.name].y = d.y
 	 });
    	linkG.attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y+10;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y+10;
                    });


                nodeG.attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function(d){
                  return d.y+10
                });
  })
  
	
}


