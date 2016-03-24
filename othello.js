(function(){
    var w = 800, h = 600;
	var n = 8;
	var mass = 50;
	var wide = mass - 10;
	var eb = [];
	eb = [[ 30,-12, 0,-1,-1, 0,-12, 30],
		  [-12,-15,-3,-3,-3,-3,-15,-12],
		  [  0, -3, 0,-1,-1, 0, -3,  0],
		  [ -1, -3,-1,-1,-1,-1, -3, -1],
		  [ -1, -3,-1,-1,-1,-1, -3, -1],
		  [  0, -3, 0,-1,-1, 0, -3,  0],
		  [-12,-15,-3,-3,-3,-3,-15,-12],
		  [ 30,-12, 0,-1,-1, 0,-12, 30]]
	var search_depth = 6;

	var bb = [];
	var wb = [];
	var temp_bb = [];
	var temp_wb = [];
	var cpb = [];
	var bm,wm;
	var lr,lc;
	var opponent;

	var canPutInt = [];

	var player;
	//var pass;
	var end;
	var phase;
    var requestId;

    var canvas = document.getElementById('canvas');
    canvas.addEventListener("click", onClick, false);
    canvas.addEventListener('mousemove', onMove, false);
    var ctx = canvas.getContext('2d');
	
    init();
	//requestId = window.requestAnimationFrame(renderTitle); 
	requestId = window.requestAnimationFrame(renderPlay); 

	function init(){
		ctx.fillStyle = '#5af';
 		ctx.fillRect(0,0,w,h);

 		lr = -1;
 		lc = -1;
 		opponent = 0;

		player = true;
		//pass = false;
		end = false;
		phase = 0;
		for(var i = 0; i < n; i++){
			bb[i] = [false,false,false,false,false,false,false,false];
			wb[i] = [false,false,false,false,false,false,false,false];
			temp_bb[i] = [false,false,false,false,false,false,false,false];
			temp_wb[i] = [false,false,false,false,false,false,false,false];
			cpb[i] = [false,false,false,false,false,false,false,false];
		}
		bb[3][4] = true;
		bb[4][3] = true;
		wb[3][3] = true;
		wb[4][4] = true;
		bCheck(false);
		popCnt();
	}

	function renderTitle(){
		//ctx.fillStyle = '#fff';
		//ctx.fillRect(10,10,20,20);

		ctx.font= 'bold 40px HG–明朝';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		ctx.strokeText('P L A Y',330,455,510);
		ctx.fillText('P L A Y',330,455);

		requestId = window.requestAnimationFrame(renderTitle); 
	}

	function renderEdit(){

	}

	function renderPlay(){
		ctx.fillStyle = '#5af';
 		ctx.fillRect(0,0,w,h);

 		//vsOpponent
 		if(phase == 0){
			ctx.fillStyle = '#e71';
 		}else{
			ctx.fillStyle = '#888';
 		}
		ctx.fillRect(580,370,180,50);
		ctx.font= 'bold 20px meiryo';
 		if(opponent==0){
			ctx.fillStyle = '#eee';
			ctx.fillText('vs Self',600,410);
 		}else if(opponent==1){
			ctx.fillStyle = '#eee';
			ctx.fillText('vs randomAI',600,410);
 		}else if(opponent==2){
			ctx.fillStyle = '#eee';
			ctx.fillText('vs normalAI',600,410);
 		}else if(opponent==3){
			ctx.fillStyle = '#eee';
			ctx.fillText('vs nega3AI',600,410);
 		}else if(opponent==4){
			ctx.fillStyle = '#eee';
			ctx.fillText('vs nega6AI',600,410);
 		}else if(opponent==5){
			ctx.fillStyle = '#eee';
			ctx.fillText('vs nega8AI',600,410);
 		}

		//turnPlayer
		if(end){
			//turn_end
			ctx.fillStyle = '#e71';
		}else if(player){
			//turn_black
			ctx.fillStyle = '#111';
		}else{
			//turn_white
			ctx.fillStyle = '#eee';
		}
		ctx.fillRect(600,50,150,50);
		
		//popCnt
		ctx.fillStyle = '#111';
		ctx.fillRect(610,160,50,50);
		ctx.fillStyle = '#eee';
		ctx.fillRect(610,260,50,50);

		ctx.font= 'bold 40px meiryo';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.strokeStyle = '#eee';
		ctx.fillStyle = '#111';
		ctx.strokeText(bm,680,200,510);
		ctx.fillText(bm,680,200);
		ctx.strokeStyle = '#111';
		ctx.fillStyle = '#eee';
		ctx.strokeText(wm,680,300,510);
		ctx.fillText(wm,680,300);

		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				if(bb[i][j]){
					ctx.fillStyle = '#111';
					ctx.fillRect(i*mass+100,j*mass+100,wide,wide);
				}else if(wb[i][j]){
					ctx.fillStyle = '#eee';
					ctx.fillRect(i*mass+100,j*mass+100,wide,wide);
				}else if(cpb[i][j]){
					ctx.fillStyle = '#fa0';
					ctx.fillRect(i*mass+100,j*mass+100,wide,wide);
					ctx.fillStyle = '#0fa';
					ctx.fillRect(i*mass+105,j*mass+105,wide-10,wide-10);
				}else{
					ctx.fillStyle = '#0fa';
					ctx.fillRect(i*mass+100,j*mass+100,wide,wide);
				}
			}
		}
		if(lr!=-1){
			ctx.fillStyle = '#a30';
			ctx.fillRect(lr*mass+100,lc*mass+100,wide,wide);
			if(bb[lr][lc]){
				ctx.fillStyle = '#111';
			}else{
				ctx.fillStyle = '#eee';
			}
			ctx.fillRect(lr*mass+105,lc*mass+105,wide-10,wide-10);
		}
		if(end){
			ctx.font= 'bold 40px meiryo';
			ctx.lineWidth = 6;
			ctx.lineJoin = 'round';
			if(bm>wm){
				ctx.strokeStyle = '#eee';
				ctx.fillStyle = '#111';
				ctx.strokeText('BLACK WIN',330,555,510);
				ctx.fillText('BLACK WIN',330,555);
			}else if(wm>bm){
				ctx.strokeStyle = '#111';
				ctx.fillStyle = '#eee';
				ctx.strokeText('WHITE WIN',330,555,510);
				ctx.fillText('WHITE WIN',330,555);
			}else{
				ctx.strokeStyle = '#eee';
				ctx.fillStyle = '#aaa';
				ctx.strokeText('DRAW',330,555,510);
				ctx.fillText('DRAW',330,555);
			}
		}
		requestId = window.requestAnimationFrame(renderPlay); 
	}

	function canPut(r,c){
		if(bb[r][c] || wb[r][c])return false;
		var v = false;
		var dd = [0,-1,0,1,-1,-1,1,1,0];
		var row,col;
		for(var i = 0; i < n; i++){
			var op = false;
			var wall = false;
			var sp = false;
			canPutInt[i] = false;
			for(var j = 1; j < 8; j++){
				row = r + dd[i]*j;
				col = c + dd[i+1]*j;
				if(row<0 || col<0 || row>n-1 || col>n-1)break;	
				if((player && wb[row][col]) || (!player && bb[row][col])){
					op = true;
				}else if((player && bb[row][col]) || (!player && wb[row][col])){
					wall = true;
				}else{
					sp = true;
				}
				if(sp)break;
				if(wall){
					if(op){
						v = true;
						canPutInt[i] = true;
					}
					break;
				}
			}
		}
		return v;
	}

	function rev(r,c){
		//if(player){console.log("black "+r+" "+c);}else{console.log("white "+r+" "+c);}
		var dd = [0,-1,0,1,-1,-1,1,1,0];
		var row,col;
		for(var i = 0; i < n; i++){
			if(canPutInt[i]){
				//console.log(i+" ok");
				for(var j = 1; j < 7; j++){
					row = r + dd[i]*j;
					col = c + dd[i+1]*j;	
					if(player && wb[row][col]){
						wb[row][col] = false;
						bb[row][col] = true;
					}else if(!player && bb[row][col]){
						wb[row][col] = true;
						bb[row][col] = false;					
					}else{
						break;
					}
				}
			}
		}
	}

	function popCnt(){
		var bsum = 0;
		var wsum = 0;
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				if(bb[i][j]){
					bsum++;
				}else if(wb[i][j]){
					wsum++;
				}
			}
		}
		bm = bsum;
		wm = wsum;
	}

	function bCheck(v){
		var psum = 0;
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				cpb[i][j] = canPut(i,j);
				if(cpb[i][j])psum++;
			}
		}
		if(psum==0){
			if(!v){
				player = !player;
				bCheck(true);
			}else{
				end = true;
			}
		}
	}

	function randomAI(){
		while(true){
			randomNext();
			player = true;
			bCheck(false);
			popCnt();
			if(player || end)break;
		}
	}

	function randomNext(){
		var nr,nc,max;
		max = -99999;
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				if(canPut(i,j)){
					var rnd = Math.floor(Math.random()*10);
					if(max==-99999 || max<eb[i][j] || rnd<5){
						max = eb[i][j];
						nr = i;
						nc = j;
					}
				}
			}
		}
		lr = nr;
		lc = nc;
		//pass = false;
		canPut(nr,nc);
		rev(nr,nc);
		wb[nr][nc] = true;
	}

	function normalAI(){
		while(true){
			normalNext();
			player = true;
			bCheck(false);
			popCnt();
			if(player || end)break;
		}
	}

	function normalNext(){
		var nr,nc,max;
		max = -99999;
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				if(canPut(i,j)){
					var pts = nextBorad(i,j);
					//console.log("pos "+i+" "+j+" pts; "+pts);
					if(max<pts){
						max = pts;
						nr = i;
						nc = j;
					}
				}
			}
		}
		//console.log("max "+nr+" "+nc+" pts; "+max);
		//console.log(" ");
		lr = nr;
		lc = nc;
		//pass = false;
		canPut(nr,nc);
		rev(nr,nc);
		wb[nr][nc] = true;
	}

	function nextBorad(r,c){
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				temp_bb[i][j] = bb[i][j];
				temp_wb[i][j] = wb[i][j];
			}
		}
		nextRev(r,c);
		temp_wb[r][c] = true;
		return calcPts(temp_bb,temp_wb);
	}

	function nextRev(r,c){
		var dd = [0,-1,0,1,-1,-1,1,1,0];
		var row,col;
		for(var i = 0; i < n; i++){
			if(canPutInt[i]){
				for(var j = 1; j < 7; j++){
					row = r + dd[i]*j;
					col = c + dd[i+1]*j;	
					if(player && wb[row][col]){
						temp_wb[row][col] = false;
						temp_bb[row][col] = true;
					}else if(!player && bb[row][col]){
						temp_wb[row][col] = true;
						temp_bb[row][col] = false;					
					}else{
						break;
					}
				}
			}
		}
	}

	function calcPts(temp_bb,temp_wb){
		//high pts is better choice
		var pts = 0;
		var bp = 0;
		var wp = 0;
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				if(temp_bb[i][j]){
					bp += eb[i][j];
					//console.log("bp "+bp+" eb "+eb[i][j]);
					pts -= eb[i][j];
				}else if(temp_wb[i][j]){
					wp += eb[i][j];
					//console.log("wp "+wp+" eb "+eb[i][j]);
					pts += eb[i][j];
				}
			}
		}
		//console.log("bp "+bp+" wp "+wp);
		return pts;
	}

	function negaAI(){
		while(true){
			var pos = negaNext(wb,bb,false,search_depth,-9999,9999);
			console.log("pos "+pos.row+" "+pos.col);
			revBoardCheck(pos.row,pos.col);
			wb[pos.row][pos.col] = true;
			lr = pos.row;
			lc = pos.col;
			player = true;
			bCheck(false);
			popCnt();
			if(player || end)break;
		}
		console.log(" ");
	}

	function revBoardCheck(r,c){
		var dir = [];
		var dd = [0,-1,0,1,-1,-1,1,1,0];
		var row,col;
		for(var i = 0; i < n; i++){
			var op = false;
			var wall = false;
			var sp = false;
			dir[i] = false;
			for(var j = 1; j < 8; j++){
				row = r + dd[i]*j;
				col = c + dd[i+1]*j;
				if(row<0 || col<0 || row>n-1 || col>n-1)break;	
				if(bb[row][col]){
					op = true;
				}else if(wb[row][col]){
					wall = true;
				}else{
					sp = true;
				}
				if(sp)break;
				if(wall){
					if(op){
						dir[i] = true;
					}
					break;
				}
			}
		}
		revBoard(dir,r,c);
	}

	function revBoard(dir,r,c){
		var dd = [0,-1,0,1,-1,-1,1,1,0];
		var row,col;
		for(var i = 0; i < n; i++){
			if(dir[i]){
				for(var j = 1; j < 7; j++){
					row = r + dd[i]*j;
					col = c + dd[i+1]*j;	
					if(bb[row][col]){
						wb[row][col] = true;
						bb[row][col] = false;					
					}else{
						break;
					}
				}
			}
		}
	}

	function negaNext(ab,enb,passed,depth,a,b){
		/*
		if(false){
			var s = [];
			for(var i = 0; i < n; i++){
				s[i] = [];
				for(var j = 0; j < n; j++){
					if(ab[i][j]){
						s[i][j]=" O";
					}else if(enb[i][j]){
						s[i][j]=" X";
					}else{
						s[i][j]=" _";
					}
				}
			}
			for(var i = 0; i < n; i++){
				console.log(s[i][0]+s[i][1]+s[i][2]+s[i][3]+s[i][4]+s[i][5]+s[i][6]+s[i][7]+i);
			}
			console.log(" ");
		}
		*/
		var or,oc,tmp,max;
		if(depth<1)
			return calcBoardEval(ab,enb);

		var child = negaChild(ab,enb);

		if(passed && child.passed)
			return calcBoardFinal(ab,enb);

		if(depth==search_depth)max = -99999;
		if(child.passed){
			//pass
			a = Math.max(a,-negaNext(enb,ab,child.passed,depth-1,-b,-a));
			if(depth==search_depth && max<a){
				max = a;
				or = child.row[i];
				oc = child.col[i];
			}
			if(a>=b){
				return a
			}
		}else{
			for(var i = 0; i < child.row.length; i++){
				var tempb = moveBoardCheck(ab,enb,child.row[i],child.col[i]);
				a = Math.max(a,-negaNext(tempb.tenb,tempb.tab,child.passed,depth-1,-b,-a));
				//if(depth==search_depth)console.log("a "+a+" pos "+child.row[i]+" "+child.col[i]);
				//console.log("d "+depth+" "+max+" ? "+a+" ");
				if(depth==search_depth && max<a){
					max = a;
					or = child.row[i];
					oc = child.col[i];
					//if(depth==search_depth)console.log("[max] "+max+" rc "+or+" "+oc);
				}
				//if(depth==1)console.log("d "+depth+" a "+a+" b "+b+" pos "+child.row[i]+" "+child.col[i]);
				if(a>=b){
					return a
				}
			}
		}
/*
		if(child.passed){
			//pass
			child = negaChild(enb,ab);
			for(var i = 0; i < child.row.length; i++){
				var tempb = moveBoardCheck(ab,enb,child.row[i],child.col[i]);
				a = Math.max(a,negaNext(tempb.tab,tempb.tenb,child.passed,depth-1,a,b));
				//console.log("pas d "+depth+" "+max+" ? "+a+" ");
				if(depth==search_depth && max<a){
					max = a;
					or = child.row[i];
					oc = child.col[i];
				}
				if(a>=b){
					return a
				}
			}
		}else{
			for(var i = 0; i < child.row.length; i++){
				var tempb = moveBoardCheck(ab,enb,child.row[i],child.col[i]);
				a = Math.max(a,-negaNext(tempb.tenb,tempb.tab,child.passed,depth-1,-b,-a));
				//if(depth==search_depth)console.log("a "+a+" pos "+child.row[i]+" "+child.col[i]);
				//console.log("d "+depth+" "+max+" ? "+a+" ");
				if(depth==search_depth && max<a){
					max = a;
					or = child.row[i];
					oc = child.col[i];
					//if(depth==search_depth)console.log("[max] "+max+" rc "+or+" "+oc);
				}
				//if(depth==1)console.log("d "+depth+" a "+a+" b "+b+" pos "+child.row[i]+" "+child.col[i]);
				if(a>=b){
					return a
				}
			}
		}
		*/
		//if(depth==search_depth)console.log("toutatu "+or+" "+oc);
		if(depth==search_depth){
			return {a:a,row:or,col:oc};
		}else{
			return a
		}
	}

	function moveBoardCheck(ab,enb,r,c){
		var dir = [];
		var dd = [0,-1,0,1,-1,-1,1,1,0];
		var row,col;
		for(var i = 0; i < n; i++){
			var op = false;
			var wall = false;
			var sp = false;
			dir[i] = false;
			for(var j = 1; j < 8; j++){
				row = r + dd[i]*j;
				col = c + dd[i+1]*j;
				if(row<0 || col<0 || row>n-1 || col>n-1)break;	
				if(enb[row][col]){
					op = true;
				}else if(ab[row][col]){
					wall = true;
				}else{
					sp = true;
				}
				if(sp)break;
				if(wall){
					if(op){
						dir[i] = true;
					}
					break;
				}
			}
		}
		return moveBoard(ab,enb,dir,r,c);
	}

	function moveBoard(ab,enb,dir,r,c){
		var tab = [];
		var tenb = [];
		for(var i = 0; i < n; i++){
			tab[i] = [];
			tenb[i] = [];
			for(var j = 0; j < n; j++){
				tab[i][j] = ab[i][j];
				tenb[i][j] = enb[i][j];
			}
		}
		var dd = [0,-1,0,1,-1,-1,1,1,0];
		var row,col;
		for(var i = 0; i < n; i++){
			if(dir[i]){
				for(var j = 1; j < 7; j++){
					row = r + dd[i]*j;
					col = c + dd[i+1]*j;	
					if(tenb[row][col]){
						tab[row][col] = true;
						tenb[row][col] = false;					
					}else{
						break;
					}
				}
			}
		}
		tab[r][c] = true;
		return {tab:tab,tenb:tenb};
	}

	function calcBoardEval(ab,enb){
		//high pts is better choice
		var pts = 0;
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				if(enb[i][j]){
					pts -= eb[i][j];
				}else if(ab[i][j]){
					pts += eb[i][j];
				}
			}
		}
		//console.log(pts);
		return pts;
	}

	function calcBoardFinal(ab,enb){
		//high pts is better choice
		var pts = 0;
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				if(enb[i][j]){
					pts--;
				}else if(ab[i][j]){
					pts++;
				}
			}
		}
		if(pts>0){
			return 1000;
		}else if(pts<0){
			return -1000;
		}else{
			return 0;
		}
	}

	function negaChild(ab,enb){
		var nr = [];
		var nc = [];
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				if(bPutCheck(ab,enb,i,j)){
					nr.push(i);
					nc.push(j);
				}
			}
		}
		if(nr.length>0){
			return {
				row : nr,
				col : nc,
				passed : false
			};
		}else{
			return {
				row : [],
				col : [],
				passed : true
			};
		}
	}

	function bPutCheck(ab,enb,r,c){
		if(ab[r][c] || enb[r][c])return false;
		var v = false;
		var dd = [0,-1,0,1,-1,-1,1,1,0];
		var row,col;
		for(var i = 0; i < n; i++){
			var op = false;
			var wall = false;
			var sp = false;
			for(var j = 1; j < 8; j++){
				row = r + dd[i]*j;
				col = c + dd[i+1]*j;
				if(row<0 || col<0 || row>n-1 || col>n-1)break;	
				if(enb[row][col]){
					op = true;
				}else if(ab[row][col]){
					wall = true;
				}else{
					sp = true;
				}
				if(sp)break;
				if(wall){
					if(op)v = true;
					break;
				}
			}
		}
		return v;
	}

	function onClick(e){
		var rect = e.target.getBoundingClientRect();
		var x =  Math.round(e.clientX - rect.left);
		var y =  Math.round(e.clientY - rect.top);
		//console.log("click "+x+" "+y);

		//reset
		if(600<x && x<750 && 50<y && y<100)
			init();

		//vsOpponentChange
		if(phase == 0 && 580<x && x<760 && 370<y && y<420){
			if(opponent<5){
				opponent++;
				if(opponent==3)search_depth=3;
				if(opponent==4)search_depth=6;
				if(opponent==5)search_depth=8;
			}else{
				opponent = 0;
			}
		}

		var xx,yy;
		for(var i = 0; i < n; i++){
			xx = i*mass+100;
			for(var j = 0; j < n; j++){
				yy = j*mass+100;
				if(xx<x && x<xx+wide && yy<y && y<yy+wide){
					if(!bb[i][j] && !wb[i][j] && canPut(i,j)){
						phase = 1;
						lr = i;
						lc = j;
						//pass = false;
						rev(i,j);
						if(player){
							//turn_black
							bb[i][j] = true;
							player = false;
						}else{
							//turn_white
							wb[i][j] = true;
							player = true;
						}
						bCheck(false);
						popCnt();
						if(!player && opponent==1){
							//randomAI
							randomAI();
						}else if(!player && opponent==2){
							//normal
							normalAI();
						}else if(!player && opponent==3){
							//negamax3
							negaAI();
						}else if(!player && opponent==4){
							//negamax6
							negaAI();
						}else if(!player && opponent==5){
							//negamax8
							negaAI();
						}
					}
				}
			}
		}
	}

	function onMove(e){
		var rect = e.target.getBoundingClientRect();
		var x =  Math.round(e.clientX - rect.left);
		var y =  Math.round(e.clientY - rect.top);
		//console.log(x+" "+y);
	}
	
})();