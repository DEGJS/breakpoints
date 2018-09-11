const window = jest.fn(() => {
    let size = 'small';

    global.getComputedStyle = jest.fn(() => {
        return {
            getPropertyValue: () => size
        }
    });
    
    global.addEventListener = jest.fn((evntName, callback) => {
        global[evntName] = () => callback();
    });

    global.setSize = jest.fn(newSize => {
        size = newSize;
    })
});


module.exports = window;