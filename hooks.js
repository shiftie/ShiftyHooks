/* exported ShiftyHooks */

var ShiftyHooks = {
	/**
	 * Adds a hook function on a hook list for an object
	 * @param {function} obj      	Function on which we want to attach a hook
	 * @param {string} hookName 	Targeted hook list that already exists via 'create' function
	 * @param {string} hookId   	The id of the hook function
	 * @param {function} hook     	The function that will be called
	 * @param {number} priority 	Level of hook priority (default: 10) (higher will be called 1st)
	 * @example
	 * ShiftyHooks.add(myFunctionObject, 'my-hook-list', 'my-hook-id', function(myFunctionObject){
	 *	// do something when hook is called
	 *  }
	 * });
	 * @example
	 * ShiftyHooks.add(myFunctionObject, 'my-hook-list', 'my-hook-id', function(myFunctionObject){
	 *	// do something when hook is called
	 *  }
	 * }, 15);
	 */
	add: function(obj, hookName, hookId, hook, priority){
		if(typeof obj === 'function' && typeof obj.prototype.hooks === 'object' && typeof hookId === 'string'){
		    priority = priority || 10;
		    if(typeof obj.prototype.hooks[hookName] === 'object'){
		        var hookList =  obj.prototype.hooks[hookName];
		        if(typeof hookList[priority] === 'object'){
		            if(typeof hookList[priority][hookId] === 'function'){
		                console.warn('ShiftyHooks.add : The hook "' + hookId + '" already exists in hook "' + hookName + '" on priority "' + priority + '"!\nThe existing hook function will be overridden!');
		            }
		            hookList[priority][hookId] = hook;
		        }else{
		            hookList[priority] = {};
		            hookList[priority][hookId] = hook;
		        }
		    }else{
		    	console.warn('Adding hook "' + hookId + '" on object "' + obj.name + '" failed since the hook list "' + hookName + '" doesn\'t exist!');
		    }
	   	}else{
	   		var message = ['Adding hook on object "' + obj.name + '" failed since'];
	   		if(typeof obj !== 'function'){
	   			message.push('the object is not a function');
	   		}else if(typeof obj.prototype.hooks !== 'object'){
	   			message.push('the object has no hook lists created');
	   		}
	   		if(typeof hookId !== 'string'){
	   			message.push('no "hookId" was provided');
	   		}
	   		message.join(',');
	   		message += '!';
			console.warn(message);
	   	}
	},
	/**
	 * Creates a hook list on the function
	 * @param  {function} obj      	Function on which we want to add the hook list
	 * @param  {string} hookName	Name of the hook list
	 * @example
	 * ShiftyHooks.create(myFunctionObject, 'my-hook-list');
	 */
	create: function(obj, hookName){
		if(typeof obj === 'function'){
			if(typeof obj.prototype.hooks === 'undefined'){
				obj.prototype.hooks = {};
			}
			if(typeof obj.prototype.hooks[hookName] === 'undefined'){
				obj.prototype.hooks[hookName] = {};
			}else{
				console.warn('Attempt to recreate an existing hook "' + hookName + '" on object "' + obj.name + '" was aborted!');
			}
		}else{
			console.warn('Object ' + obj.name + ' hooks couldn\'t been inited since its type is not a function!');
		}
	},
	/**
	 * Calls all attached hooks on the provided hookName by descending priority
	 * @param  {function} obj      	Function with attached hooks
	 * @param  {string} hookName 	The selected hook list
	 */
	doAction: function(obj, hookName) {
        if(obj.hooks[hookName]){
            var priority,
                hookFunction,
                hooksList = [];
            // Reverse hook priorities (descending)
            for (priority in obj.hooks[hookName]) {
                hooksList.push(obj.hooks[hookName][priority]);
            }
            hooksList = hooksList.reverse();
            for (priority in hooksList) {
                for (hookFunction in hooksList[priority]) {
                    console.log('hook ' + hookFunction);
                    hooksList[priority][hookFunction](obj);
                }
            }
        }
    },
    /**
     * Returns hooks on the function
     * @param  {function} obj      	Function with attached hooks
     * @param  {[type]} hookName 	The selected hook list (if none provided, will return all hook lists)
     * @return {object}          	Hook lists object
	 * @example
	 * ShiftyHooks.get(myFunctionObject);
	 * @example
	 * ShiftyHooks.get(myFunctionObject, 'my-hook-list');
     */
    get: function(obj, hookName){
    	var result = false;
    	if(typeof obj === 'function'){
    		if(obj.prototype.hooks){
    			if(hookName && typeof obj.prototype.hooks[hookName] === 'object'){
    				result = obj.prototype.hooks[hookName];
    			}else{
    				result = obj.prototype.hooks;
    			}
    		}
    	}
    	return result;
    },
    /**
	 * Removes a hook function from a hook list for an object
	 * @param {function} obj      	Function from which we want to dettach a hook
	 * @param {string} hookName 	Targeted hook list that already exists via 'create' function
	 * @param {string} hookId   	The id of the hook function
	 * @param {number} priority 	Level of hook priority (default: 10) (higher will be called 1st)
	 * @example
	 * ShiftyHooks.remove(myFunctionObject, 'my-hook-list', 'my-hook-id');
	 * @example
	 * ShiftyHooks.remove(myFunctionObject, 'my-hook-list', 'my-hook-id', 15);
	 */
    remove: function(obj, hookName, hookId, priority){
		priority = priority || 10;
		if(
			typeof obj === 'function' &&
			typeof obj.prototype.hooks === 'object' &&
			typeof hookId === 'string' &&
			typeof obj.prototype.hooks[hookName] === 'object' &&
			typeof obj.prototype.hooks[hookName][priority] === 'object' &&
			typeof obj.prototype.hooks[hookName][priority][hookId] === 'function'
		){
			delete(obj.prototype.hooks[hookName][priority][hookId]);
		}else{
			var message = ['Removing hook on object "' + obj.name + '" failed since'];
	   		if(typeof obj !== 'function'){
	   			message.push('the object is not a function');
	   		}else{
	   			if(typeof obj.prototype.hooks !== 'object'){
	   				message.push('the object has no hook lists created');
	   			}
	   			if(typeof obj.prototype.hooks[hookName] !== 'object'){
	   				message.push('the hook list "' + hookName + '" doesn\'t exist');
	   			}else{
	   				if(typeof obj.prototype.hooks[hookName][priority] !== 'object'){
		   				message.push('the priority "' + priority + '" on hook list "' + hookName + '" doesn\'t exist');
		   			}else if(typeof obj.prototype.hooks[hookName][priority][hookId] !== 'function'){
			   			message.push('the requested hookId "' + hookId + '" doesn\'t exist on priority "' + priority + '" on hook list "' + hookName + '"');
		   			}
	   			}
	   		}
	   		if(typeof hookId !== 'string'){
	   			message.push('no "hookId" was provided');
	   		}
	   		message.join(',');
	   		message += '!';
			console.warn(message);
		}
	}
};