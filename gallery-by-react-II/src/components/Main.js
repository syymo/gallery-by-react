//css
require('normalize.css/normalize.css');
require('styles/App.css');


import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');
//let yeomanImage = require('../images/yeoman.png');
/*
function getImageURL(imageDatasArr){
	for(var i=0,j=imageDatasArr.length;i<j;i++){
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/'+singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
}
iamgeDatas = getImageURL(imageDatas);
*/

//利用自执行函数，将图片信息转成图片URL路径信息
//只运行一次的函数
imageDatas = (function getImageURL(imageDatasArr){
	for(var i=0,j=imageDatasArr.length;i<j;i++){
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/'+singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

//获取区间内的一个随机值
function getRangeRandom(low, high){
	return Math.ceil(Math.random()*(high -low) + low);
}

//获取-30-30的一个任意值作为旋转角度
function get30DegRandom(){
    return ((Math.random()>0.5 ? '' : '-') + Math.ceil(Math.random()*30));
}

//创建图片结构
var ImgFigure = React.createClass({
    //imgFigure的点击处理函数
    handleClick: function(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    },

	render:function(){

		var styleObj = {}
		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

        //如果图片的旋转角度有值且不为0，添加旋转角度
        if(this.props.arrange.rotate){
            (['MozTransform','msTransform','WebkeiTransform']).forEach(function(value){
                styleObj[value + 'transform'] = 'rotate('+this.props.arrange.rotate + 'deg)';
            }.bind(this));
            
        }

        if(this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
				</figcaption>
			</figure>
		)
	}
});

//控制组件
var ControllerUnit = React.createClass({
    handleClick: function(e){
        //如果点击的是当前正在选中态的按钮，则翻转照片，否则将对应的图片居中
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    },
    render:function(){
        var controllerUnitClassName = 'controller-unit';
        /*
        如果对应的是居中的图片，显示控制按钮的居中态
        如果同时对应的是翻转图片，显示控制按钮的翻转态
        */
        if(this.props.arrange.isCenter){
            controllerUnitClassName += ' is-center';
            if(this.props.arrange.isInverse){
                controllerUnitClassName += ' is-inverse';
            }
        }
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        );
    }
});

/*class AppComponent extends React.Component {*/
var AppComponent = React.createClass({
	//存储排布的取值范围
	Constant:{
		centerPos:{
			left:0,
			top:0
		},
		hPosRange:{ //水平方向的取值范围
			leftSecX: [0,0],
			rightSecX: [0,0],
			y:[0,0]
		},
		vPosRange:{ //垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
  	},
    /*
     * 翻转图片
     * @param index 输入当前被执行inverse操作的图片对应的图片的index值
     * @return {Function} 这是一个闭包函数 其内return真正待被执行的函数
    */
    inverse: function(index){
        return function(){
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    },

  	//排布函数
  	/*
	 * 重写布局所有图片
	 * @param centerIndex 指定居中排布那个图片
  	*/
  	rearrange: function(centerIndex){
        //所有图片的状态信息
  		var imgsArrangeArr = this.state.imgsArrangeArr;
  		var Constant = this.Constant;
  		var centerPos = Constant.centerPos;
  		var hPosRange = Constant.hPosRange;
  		var vPosRange = Constant.vPosRange;
  		var hPosRangeLeftSecX = hPosRange.leftSecX;
  		var hPosRangeRightSecX = hPosRange.rightSecX;
  		var hPosRangeY = hPosRange.y;
  		var vPosRangeTopY = vPosRange.topY;
  		var vPosRangeX = vPosRange.x;
  		
  		var imgsArrangeTopArr = [];
  		//取一个或者不去
  		var topImgNum = Math.floor(Math.random()*2);
  		//用来记录上侧图片是从数组哪里取出来的
  		var topImgSpliceIndex = 0;
  		//用来记录居中图片  从centerIndex位置去掉一个
  		var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

  		//首先居中centerIndex的图片
  		imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter:true
        };
  		
      /*  //居中的centerIndex的图片不需要旋转
        imgsArrangeCenterArr[0].rotate = 0;
*/
  		//取出要布局上侧的图片的状态信息
  		topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
  		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

  		//布局位于上侧的图片
  		imgsArrangeTopArr.forEach(function(value,index){
  			imgsArrangeTopArr[index] = {
                pos:{
                    top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0],vPosRangeX[1]) 
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
  		});

  		//布局左右两侧的图片
  		for(var i = 0, j = imgsArrangeArr.length, k=j/2;i<j;i++){
  			var hPosRangeLORX = null;
  			//前半部分布局在左边，右半部分右边
  			if(i<k){
  				hPosRangeLORX = hPosRangeLeftSecX;
  			}else{
  				hPosRangeLORX = hPosRangeRightSecX;
  			}

  			imgsArrangeArr[i] = {
                pos:{
                    top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                    left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }; 
  		}
        //debugger;   //调试
  		//把之前上侧区域的图片放回去
  		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
  			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
  		}
  		//把之前中间区域的图片放回去
  		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
  		//设置state
  		this.setState({
  			imgsArrangeArr: imgsArrangeArr
  		})
  	},
    /**
     * 利用rearrange函数居中index的图片
     * @param index 需要被居中图片所在数组index
     * @return {Function}
    */
    center: function(index) {
        return function() {
            this.rearrange(index);
        }.bind(this);
    },

  	//初始化index值
  	getInitialState: function(){
  		return {
  			imgsArrangeArr: [
  				/*{
  					pos:{
  				  		left: '0',
  				  		top: '0'
  				  	},
                    rotate: 0,    //旋转角度
                    isInverse: false   //图片正反面
  				}*/
  			]
  		};
  	},
  	//组件加载以后，为每张图片计算其位置的范围
  	componentDidMount:function(){
  		//首先拿到舞台的大小
  		var stageDOM = ReactDOM.findDOMNode(this.refs.stage);
  		var stageW = stageDOM.scrollWidth;
  		//获取对象实际内容的宽度不包含滚动条等边线宽度
  		var stageH = stageDOM.scrollHeight;
  		var halfStageW = Math.ceil(stageW/2);
  		var halfStageH = Math.ceil(stageH/2);

  		//拿到一个imgFigure的大小
  		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
  			//获取一张图的宽
  		var imgW = imgFigureDOM.scrollWidth;
  			//获取一张图的高
  		var imgH = imgFigureDOM.scrollHeight;
  		var halfImgW = Math.ceil(imgW/2);
  		var halfImgH = Math.ceil(imgH/2);

  		//计算中心图片的位置点
  		this.Constant.centerPos = {
  			left:halfStageW - halfImgW,
  			top:halfStageH - halfImgH
  		};

  		//计算左侧，右侧区域图片排布位置的取值范围
  		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
  		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
  		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
  		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
  		this.Constant.hPosRange.y[0] = -halfImgH;
  		this.Constant.hPosRange.y[1] = stageH - halfImgH;

  		//计算上侧区域图片排布位置的取值范围
  		this.Constant.vPosRange.topY[0] = -halfImgH;
  		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
  		this.Constant.vPosRange.x[0] = halfStageW - imgW;
  		this.Constant.vPosRange.x[1] = halfStageW;

  		this.rearrange(0);
  	},

	render() {
	  	var controllerUnits = [],
				imgFigures = [];
		//拿到图片并放进数组中去
		imageDatas.forEach(function(value,index){
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos:{
  				  		left: '0',
  				  		top: '0'
  				  	},
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
				};

			}

			imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

            controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]}
                key={index}
                inverse={this.inverse(index)}
                center={this.center(index)} />);

		}.bind(this));

	    return (
	    	<section className="stage" ref="stage">
	    		<section className="img-src">
	    			{imgFigures}
	    		</section>
	    		<nav className="controller-nav">
	    			{controllerUnits}
	    		</nav>
	    	</section>   
	    );
	}
});

AppComponent.defaultProps = {

};

export default AppComponent;


/*{<div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <span></span>
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>}*/