layui.use(['element', 'jquery', 'form', 'layedit', 'flow', 'layer'], function() {
	var element = layui.element;
	var form = layui.form;
	var $ = layui.jquery;
	var layedit = layui.layedit;
	var flow = layui.flow;
	var layer = layui.layer;


	// 开启超文本输入
	var index = layedit.build('commentEditor', {
		height: 150,
		tool: ['face', '|', 'link'],
	});

	
	//监听评论表单
	form.on('submit(formComment)', function(data) {
		$.ajax({
			url: "http://212.64.70.240:8080/article/commentBlog",
			type: "POST",
			contentType: "application/json;charset=UTF-8",
			dataType: 'json',
			async: false,
			data: JSON.stringify(data.field),
			success: function(result) {
				console.info(data.field)
				if (result.success == true) {
					layer.msg(result.msg);
					window.location.replace(window.location.href)
				} else {
					layer.msg(result.msg);
				}
			},
			error: function(e) {
				console.info(e)
			}
		})
		return false;
	});
		//评论和留言的编辑器的验证
		form.verify({
			content: function(value) {
				value = $.trim(layedit.getContent(index));
				if (value == "") return "请输入内容";
				layedit.sync(index);
			},
			replyContent: function(value) {
				if (value == "") return "请输入内容";
			}
		});
		
		
		// 监听回复表单
		form.on('submit(formReply)', function(data) {
			$.ajax({
				url: "http://212.64.70.240:8080/article/replyComment",
				type: "POST",
				contentType: "application/json;charset=UTF-8",
				dataType: 'json',
				data: JSON.stringify(data.field),
				success: function(result) {
					if (result.success == true) {
						layer.msg(result.msg);
						window.location.replace(window.location.href)
					} else {
						layer.msg(result.msg);
					}
				},
				error: function(e) {
					console.info(e)
				}
			})
			return false;
		});




	//页面一读取就加载数据
	$(document).ready(function() {
		$.ajax({
			url: "http://212.64.70.240:8080/article/blogInfo?id=" + GetQueryString("id"),
			type: "GET",
			dataType: 'json',
			async: false,
			success: function(result) {
				$("#blogId").val(parseInt(GetQueryString("id")));
				createInfo(result.data);
				$("#appendTest").text(result.data.content);
				var commentArr = result.data.comments;
				for (var i = 0; i < commentArr.length; i++) {
					createParent(commentArr[i]);
				}
			},
			error: function(e) {
				window.location.replace("404.html");
			}
		})
	});




	//监听回复按钮
	$('#blog-comments').on('click', '.btn-reply', function() {
		var targetId = $(this).data('targetid'),
			targetName = $(this).data('targetname'),
			blogId = GetQueryString("id"),
			$container = $(this).parent('p').parent().siblings('.replycontainer');
		if ($(this).text() == '回复') {
			$container.find('textarea').attr('placeholder', '回复【' + targetName + '】');
			$container.removeClass('layui-hide');
			$container.find('input[name="replyId"]').val(targetId);
			$container.find('input[name="blogId"]').val(blogId);
			$container.find('input[name="targetName"]').val(targetName);
			$(this).parents('.message-list li').find('.btn-reply').text('回复');
			$(this).text('收起');
		} else {
			$container.addClass('layui-hide');
			$container.find('input[name="targetId"]').val(0);
			$(this).text('回复');
		}
	});

	editormd.markdownToHTML("content-md", {
		htmlDecode: "style,script,iframe", //可以过滤标签解码
		emoji: true,
		taskList: true,
		tex: true, // 默认不解析
		flowChart: true, // 默认不解析
		sequenceDiagram: true, // 默认不解析
	});



	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

	function createInfo(blogInfo) {
		var title = blogInfo.title;
		var author = blogInfo.author;
		var updateTime = blogInfo.updateTime;
		var views = blogInfo.views;
		var day = blogInfo.createDay;
		var year = blogInfo.createYear;
		var month = blogInfo.createMonth;
		var str = '';
		str += '<h4>' + title + '</h4>';
		str += '<p class="fc-grey fs-14"><small>作者：<a href="#"  class="fc-link">' + author + '</a></small>'
		str += '<small class="ml10">围观群众：<i class="readcount">' + views + '</i></small>'
		str += '<small class="ml10">最后更新于 <label>' + updateTime + '</label> </small>'
		str += '</p>'
		$('#title').append(str);
		str = '';
		str += '<span class="day">' + day + '</span>'
		str += '<span class="month fs-18">' + month + '<small class="fs-14">月</small></span>'
		str += '<span class="year fs-18">' + year + '</span>'
		$('#createTime').append(str);
		str = ''
		str += '<p class="f-toe fc-black">非特殊说明，本文版权归 ' + author + ' 所有，转载请注明出处.</p>'
		str += '<p class="f-toe">本文标题：<a href="javascript:void(0)" class="r-title">' + title + '</a></p>'
		str += '<p class="f-toe">本文网址：<a href="#">https://www.yanshisan.cn/Blog/Read/7</a></p>'
		$('#statement').append(str);
		if(blogInfo.conmentabled==false){
			$("#conmentabled").html("");
			$("#conmentabled").append('<legend>此文章已关闭新评论功能</legend>');
		}
	}



	function createParent(comment) {
		var str = '';
		var parentId = comment.parent.id;
		var nikeName = comment.parent.nikeName;
		var email = comment.parent.email;
		var content = comment.parent.content;
		var createTime = comment.parent.createTime;
		var childs = comment.childs;
		str += '	<li class="zoomIn article"><div class="comment-parent">';
		str += '<a name="remark-' + parentId + '"></a>';
		str += '<img src="' +
			'' + comment.parent
			.imag + '" />';
		str += '<div class="info"><span class="username">' + nikeName + '</span></div>';
		str += '<div class="comment-content">' + content + '</div>';
		str += '<p class="info info-footer"><span class="comment-time">' + createTime +
			'</span><a href="javascript:;" class="btn-reply" data-targetid="' + parentId + '" data-targetname="' + nikeName +
			'">回复</a></p></div>';
		// ---------------------
		if (childs.length > 0) {
			str += createChild(childs, nikeName);

		}
		str += '<div class="replycontainer layui-hide">'
		str +=
			'<form class="layui-form" action=""><input type="hidden" name="targetName"><input type="hidden" name="blogId"><input type="hidden" name="replyId"><div class="layui-form-item"><textarea name="content" lay-verify="replyContent" placeholder="请输入回复内容" class="layui-textarea" style="min-height:80px;"></textarea></div>'
		str +=
			'<div class="layui-form-item"><div class="layui-inline"><span class="layui-form-label bottom_span">ID:</span><div class="layui-input-inline"><input type="tel" id="nikeName" name="nikeName" lay-verify="required" autocomplete="off" class="layui-input"></div></div><div class="layui-inline"><span class="layui-form-label bottom_span">邮箱:</span><div class="layui-input-inline"><input type="text" id="email" name="email" lay-verify="email" autocomplete="off" class="layui-input"></div></div><button class="layui-btn" lay-submit="" lay-filter="formReply">回复</button></div>'
		str += '</form></div></li>'
		$('#blog-comments').append(str);
	}

	function createChild(childs, parentName) {
		var str = '';
		for (i = 0; i < childs.length; i++) {
			var replyId = childs[i].replyId;
			var childName = childs[i].nikeName;
			var content = childs[i].content;
			var replyTime = childs[i].createTime;
			var targetName = childs[i].targetName;
			var blogId = childs[i].blogId;
			str += '<hr /><div class="comment-child"><a name="reply-' + replyId + '"></a>'
			str += '<img src="' +
				'' + childs[i]
				.imag + '" />'
			str += '<div class="info"><span class="username">' + childName +
				'</span><span style="padding-right:0;margin-left:-5px;">回复</span><span class="username">' + targetName +
				'</span><span>' + content + '</span></div>'
			str += '<p class="info"><span class="comment-time">' + replyTime +
				'</span><a href="javascript:;" class="btn-reply"  data-blogId=' + blogId + ' data-targetid="' + replyId +
				'" data-targetname="' + childName +
				'">回复</a></p></div>'
		}

		return str;
	}
});
