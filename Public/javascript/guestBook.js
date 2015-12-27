var toRow = function(entry){
	return ['<tr>','<td>',new Date(entry.time),'</td>','<td>',entry.name, '</td>','<td>', entry.comment, '</td>','</tr>'].join(' ');
};
var generateTable = function(comments){
	return '<table><tr><th>Time</th><th>Name</th><th>Comment</th></tr>' + comments.map(toRow).join(' ') + '</table>';
};
var updateComments = function(){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	    if (req.readyState == 4 && req.status == 200) {
	        var comments = JSON.parse(req.responseText);
	        document.querySelector('#comments').innerHTML = generateTable(comments)
	    }
	};
	req.open('GET', 'comments', true);
	req.send();
};
var postComment = function(){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	    if (req.readyState == 4 && req.status == 200) {
	        var comments = JSON.parse(req.responseText);
	      	document.querySelector('#comments').innerHTML = generateTable(comments);
	      	document.querySelector('input[name="name"]').value = '';
	      	document.querySelector('textarea[name="comment"]').value = '';
	    }
	};
	req.open('POST', 'comment', true);
	req.send('name='+document.querySelector('input[name="name"]').value+'&comment='+document.querySelector('textarea[name="comment"]').value);
};
window.onload = function(){
	updateComments();
	document.querySelector('button').onclick = postComment;
};
