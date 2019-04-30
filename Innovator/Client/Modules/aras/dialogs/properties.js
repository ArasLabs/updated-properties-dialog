(function(externalParent) {
	if (!(window.ArasModules && window.ArasModules.Dialog)) {
		return;
	}
	var aras;
	var dialogNode;
	var itemTypeName;
	var itemNode;
	var itemTypeNode;

	function getItemId(isItemId) {
		var isVersionable = aras.getItemProperty(itemTypeNode, 'is_versionable') === '1';
		return aras.getItemProperty(itemNode, (isVersionable && !isItemId) ? 'config_id' : 'id');
	}

	function copyToclipboard(text, message) {
		if (aras.utils.isClipboardSupported()) {
			ArasModules.copyTextToBuffer(text, dialogNode);
			window.ArasModules.notify(message, {container: dialogNode});
		} else {
			aras.AlertError(aras.getResource('', 'clipboardmanager.use_ctrl_c'));
		}
	}

	function copyUrl(option, isItemId) {
		var text = aras.getInnovatorUrl() + '?StartItem=' + itemTypeName + ':' + getItemId(isItemId) + (option ? ':' + option : '');
		copyToclipboard(text, aras.getResource('', 'common.copy_notification_link'));
	}

	function urlEventHandler(e) {
		if (e.target.classList.contains('disabled-item')) {
			return;
		}
		switch (e.target.dataset.action) {
			case 'copy-url':
				copyUrl('', true);
				break;
			case 'latest':
				copyUrl('current');
				break;
			case 'latest-released':
				copyUrl('released');
				break;
		}
	}

	function createUrlButtons(container, copyButton, qrButton) {
		var urlButtonsContainer = document.createElement('div');
		urlButtonsContainer.classList.add('url-buttons-container');
		var copyUrlButton = document.createElement('button');
		copyUrlButton.classList.add('aras-btn','copy-url-btn');
		copyUrlButton.textContent = aras.getResource('', 'common.copy_link');
		copyUrlButton.dataset.action = 'copy-url';
		var dropdownContainer = document.createElement('div');
		dropdownContainer.classList.add('aras-dropdown-container');
		var dropdownButton = document.createElement('div');
		var qrButtonContainer = document.createElement('div');
		qrButtonContainer.classList.add('url-buttons-container');
		dropdownButton.classList.add('aras-btn', 'copy-url-dropdown-btn', 'aras-icon-arrow', 'aras-icon-arrow_down');
		var dropdownBox = document.createElement('div');
		dropdownBox.classList.add('aras-dropdown');
		var optionsList = document.createElement('ul');
		optionsList.classList.add('aras-list');
		copyButton.classList.add('copy-id-button');
		urlButtonsContainer.appendChild(copyButton);
		qrButtonContainer.appendChild(qrButton);
		qrButtonContainer.align = "center";
		var qrCode = document.createElement('div');
		urlButtonsContainer.appendChild(dropdownContainer);
		qrCode.id = 'qrCode';
		qrCode.align = "center";
		dropdownContainer.appendChild(copyUrlButton);
		dropdownContainer.appendChild(dropdownButton);
		dropdownContainer.appendChild(dropdownBox);
		dropdownBox.appendChild(optionsList);
		var li = document.createElement('li');
		if (aras.getItemProperty(itemTypeNode, 'is_versionable') === '0') {
			li.classList.add('disabled-item');
		}
		li.textContent = aras.getResource('', 'common.copy_link_latest');
		li.dataset.action = 'latest';
		optionsList.appendChild(li.cloneNode(true));
		li.textContent = aras.getResource('', 'common.copy_link_latest_released');
		li.dataset.action = 'latest-released';
		optionsList.appendChild(li);
		container.appendChild(qrCode);
		container.appendChild(urlButtonsContainer);
		container.appendChild(qrButtonContainer);
		urlButtonsContainer.addEventListener('click', urlEventHandler);
	}
	
	function showQR(qrButton){
		document.getElementById("qrCode").hidden = false;
		qrButton.onclick = function(){hideQR(qrButton)};
		qrButton.textContent = "Hide QR Code";
	}

	function hideQR(qrButton){
		document.getElementById("qrCode").hidden = true;
		qrButton.onclick = function(){showQR(qrButton)};
		qrButton.textContent = "Show QR Code";
	}
	var properties = function(item, itemType, options) {
		options = options || {};
		aras = options.aras || window.aras;
		if (!aras) {
			return Promise.reject();
		}

		itemTypeName = aras.getNodeElement(itemType, 'name');
		itemNode = aras.getItemById(itemTypeName, item.getAttribute('id'), 0) || item;
		itemTypeNode = itemType;
		var itemTypeLabel = aras.getNodeElement(itemType, 'label');
		var dialogTitle = options.title || aras.getResource('', 'propsdialog.item_type_label__item_keyed_name__properties', itemTypeLabel, aras.getKeyedNameEx(item));
		var propsDialog = new ArasModules.Dialog('html', {
			title: dialogTitle
		});
		dialogNode = propsDialog.dialogNode;
		var contentNode = propsDialog.contentNode;
		dialogNode.classList.add('aras-dialog_properties');
		var tableNode = document.createElement('div');
		tableNode.classList.add('properties-table-container');
		contentNode.appendChild(tableNode);

		var infoTable = aras.uiDrawItemInfoTable(itemType);
		tableNode.innerHTML = infoTable;

		aras.uiPopulateInfoTableWithItem(item, propsDialog.dialogNode.ownerDocument);
		var copyButton = document.createElement('button');
		copyButton.classList.add('aras-btn');
		copyButton.title = item.getAttribute('id');
		var qrButton = document.createElement('button');
		qrButton.classList.add('aras-btn');
		qrButton.textContent = "Show QR Code";
		qrButton.onclick = function() {showQR(qrButton)};
		var copyButtonTextResourse;
		createUrlButtons(contentNode, copyButton, qrButton);
		copyButtonTextResourse = 'common.copy_id';

		copyButton.textContent = aras.getResource('', copyButtonTextResourse);
		copyButton.addEventListener('click', function() {
			copyToclipboard(getItemId(true), aras.getResource('', 'common.copy_notification_id'));
		});
		
		var text = aras.getInnovatorUrl() + '?StartItem=' + itemTypeName + ':' + item.getAttribute('id');

		var code = new QRCode(document.getElementById("qrCode"), {
			text: text,
			width: 192,
			height: 192,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
		document.getElementById("qrCode").hidden = true;


		propsDialog.show();



		ArasModules.dropdownButton(contentNode.querySelector('.aras-dropdown-container'), {pos: 'bottom-left', buttonSelector: '.copy-url-dropdown-btn'});
		return propsDialog.promise;
	};

	externalParent.Dialogs = externalParent.Dialogs || {};
	externalParent.Dialogs.properties = properties;
	window.ArasCore = window.ArasCore || externalParent;
})(window.ArasCore || {});
