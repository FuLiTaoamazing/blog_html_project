layui.use(['element', 'jquery', 'form', 'layedit', 'flow', 'layer'], function() {
	var element = layui.element;
	var form = layui.form;
	var $ = layui.jquery;
	var layedit = layui.layedit;
	var flow = layui.flow;
	var layer = layui.layer;
	//评论和留言的编辑器
	var editIndex = layedit.build('remarkEditor', {
		height: 150,
		tool: ['face', '|', 'link'],
	});
	//评论和留言的编辑器的验证
	form.verify({
		content: function(value) {
			value = $.trim(layedit.getContent(editIndex));
			if (value == "") return "请输入内容";
			layedit.sync(editIndex);
		},
		replyContent: function(value) {
			if (value == "") return "请输入内容";
		}
	});
	//页面加载就开始填充留言数据
	$(document).ready(function() {
		$.ajax({
			url: "http://212.64.70.240:8080/message/list",
			type: "GET",
			dataType: 'json',
			success: function(result) {
				for (var i = 0; i < result.data.length; i++) {
					createParent(result.data[i]);
				}
			}
		})
	});
	// 监听回复表单
	form.on('submit(formReply)', function(data) {
		$.ajax({
			url: "http://212.64.70.240:8080/message/reply",
			type: "POST",
			contentType: "application/json;charset=UTF-8",
			dataType: 'json',
			data: JSON.stringify(data.field),
			success: function(result) {
				if (result.success == true) {
					layer.msg(result.msg);
					window.location.reload();
				} else {
					layer.msg(result.msg);
				}
			},
			error: function(e) {
				console.info(e)
			}
		})
	});
	//监听留言表单
	form.on('submit(formMessage)', function(data) {
		$.ajax({
			url: "http://212.64.70.240:8080/message/add",
			type: "POST",
			contentType: "application/json;charset=UTF-8",
			dataType: 'json',
			data: JSON.stringify(data.field),
			success: function(result) {
				if (result.success == true) {
					layer.msg(result.msg);
					sessionStorage.setItem("nikeName", data.field.nikeName);
					sessionStorage.setItem("email", data.field.email);
					window.location.reload();
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


	//回复按钮点击事件
	$('#message-list').on('click', '.btn-reply', function() {
		var email = sessionStorage.getItem("email");
		var nikeName = sessionStorage.getItem("nikeName");
		var targetId = $(this).data('targetid'),
			targetName = $(this).data('targetname'),
			$container = $(this).parent('p').parent().siblings('.replycontainer');
		if (email != null & nikeName != null) {
			$container.removeClass('layui-hide')
		}
		if ($(this).text() == '回复') {
			$container.find('textarea').attr('placeholder', '回复【' + targetName + '】');
			// $container.removeClass('layui-hide');
			$container.find('input[name="targetUserId"]').val(targetId);
			$container.find('input[name="replyId"]').val(targetId);
			$container.find('input[name="targetName"]').val(targetName);
			$(this).parents('.message-list li').find('.btn-reply').text('回复');
			$(this).text('收起');
		} else {
			$container.addClass('layui-hide');
			$container.find('input[name="targetUserId"]').val(0);
			$(this).text('回复');
		}
	});
	
	
	
	
	
	function createParent(message) {
		var str = '';
		var parentId = message.parent.id;
		var nikeName = message.parent.nikeName;
		var email = message.parent.email;
		var content = message.parent.content;
		var createTime = message.parent.createTime;
		var childs = message.childs;
		str += '	<li class="zoomIn article"><div class="comment-parent">';
		str += '<a name="remark-' + parentId + '"></a>';
		str += '<img src="' +
			'' + message.parent
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
			'<form class="layui-form" action=""><input type="hidden" name="targetName"><input type="hidden" name="replyId"><div class="layui-form-item"><textarea name="content" lay-verify="replyContent" placeholder="请输入回复内容" class="layui-textarea" style="min-height:80px;"></textarea></div>'
		str +=
			'<div class="layui-form-item"><div class="layui-inline"><span class="layui-form-label bottom_span">ID:</span><div class="layui-input-inline"><input type="tel" id="nikeName" name="nikeName" lay-verify="required" autocomplete="off" class="layui-input"></div></div><div class="layui-inline"><span class="layui-form-label bottom_span">邮箱:</span><div class="layui-input-inline"><input type="text" id="email" name="email" lay-verify="email" autocomplete="off" class="layui-input"></div></div><button class="layui-btn" lay-submit="" lay-filter="formReply">回复</button></div>'
		str += '</form></div></li>'
		$('#message-list').append(str);
	}

	function createChild(childs, parentName) {
		var str = '';
		for (i = 0; i < childs.length; i++) {
			var replyId = childs[i].replyId;
			var childName = childs[i].nikeName;
			var content = childs[i].content;
			var replyTime = childs[i].createTime;
			var targetName = childs[i].targetName;
			str += '<hr /><div class="comment-child"><a name="reply-' + replyId + '"></a>'
			str += '<img src="' +
				'http://http://47.95.112.192/:8848/layui%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%E5%89%8D%E7%AB%AF%E6%A8%A1%E6%9D%BF/' + childs[i]
				.imag + '" />'
			str += '<div class="info"><span class="username">' + childName +
				'</span><span style="padding-right:0;margin-left:-5px;">回复</span><span class="username">' + targetName +
				'</span><span>' + content + '</span></div>'
			str += '<p class="info"><span class="comment-time">' + replyTime +
				'</span><a href="javascript:;" class="btn-reply" data-targetid="' + replyId + '" data-targetname="' + childName +
				'">回复</a></p></div>'
		}

		return str;
	}
});
