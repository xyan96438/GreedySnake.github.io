//239. 貪吃蛇

/* 
+ 遊戲本身
    => 不包含任何對於遊戲的控制
    => 只是單純的遊戲本身
+ 遊戲控制
    => 利用你當前終端和用戶的交互來控制遊戲(比如：如果是電腦版可能使用按鍵；手機版可能使用滑動等)
*/


/* 遊戲本身(貪吃蛇)
  + 食物：
    => 決定一個食物出現在地圖的什麼位置
    => 如何對這個食物更換位置
  + 蛇：
    => 如何出現一條蛇
    => 蛇如何移動
    => 是否與食物座標重疊
    => 是否死亡
  + 遊戲規則：
    => 組織起 食物 和 蛇
    => 進行開始遊戲的控制
    => 進行暫停遊戲的控制
    => 進行重新開始遊戲的控制
    => 進行修改方向的控制(部和頁面的任何內容交互)
*/


// 食物的 類

/* 
需要的元素(屬性)：
    範圍：地圖
    食物標籤
    x：表示食物的 x 座標
    y：表示食物的 y 座標
需要添加的方法：
    能在 地圖 範圍內隨機給 食物 設置一個座標點

*/

//玩遊戲的按鈕
var startBtn = document.querySelector('#start')
var pauseBtn = document.querySelector('#pause')
var restartBtn = document.querySelector('#restart')



class Food {
    constructor(ele) {
        this.map = document.querySelector(ele)
        //食物的div用創建的
        this.food = document.createElement('div')
        this.food.className = 'food'
        this.map.appendChild(this.food)

        this.x = 0
        this.y = 0

        this.changePos()

    }

    // 隨機改變食物座標位置
    changePos(po) {

        let check = true
        console.log(po)

        //1.位置的範圍是？要參照map的尺寸
        let map_width = this.map.clientWidth
        let map_height = this.map.clientHeight

        //2.由於圖片設置都是20px，所以座標也必須設置在20的倍數位置
        //2-1.計算出一行/一列能放多少個食物
        let row_num = map_width / 20 - 1
        let col_num = map_height / 20 - 1


        //3.計算出放在哪一個的位置？會是 0 ~ num 的隨機整數
        let pos_x = Math.floor(Math.random() * (row_num + 1))
        let pos_y = Math.floor(Math.random() * (col_num + 1))

        //4. 計算出放在第幾個 的實際座標位置
        this.x = pos_x * 20
        this.y = pos_y * 20

        // function calculate() {

        //     let arr = { a: 0, b: 0 }
        //     //3.計算出放在哪一個的位置？會是 0 ~ num 的隨機整數
        //     let pos_x = Math.floor(Math.random() * (row_num + 1))
        //     let pos_y = Math.floor(Math.random() * (col_num + 1))

        //     //4. 計算出放在第幾個 的實際座標位置
        //     let x = pos_x * 20
        //     arr.a = x
        //     let y = pos_y * 20
        //     arr.b = y

        //     //4.食物的創建位置不能跟蛇重疊
        //     for (let i = 0; i < po.x.length; i++) {
        //         if (!(x === po.x[i] && y === po.y[i])) {
        //             check = false
        //         }
        //     }
        //     return arr
        // }

        // do {
        //     calculate()
        // } while (check)

        // this.x = arr.a
        // this.y = arr.b


        //5.將座標位置賦值給 食物
        this.food.style.left = this.x + 'px'
        this.food.style.top = this.y + 'px'
    }
}



// 蛇的 類

/* 
需要的元素(屬性)：
    範圍：地圖
    方向：往哪可以自己設置，這邊默認為一開始朝右
    蛇：以去尾增頭改標籤的方式運行，所以可將其設置為陣列數據類型
        => [頭,身體,身體,身體,身體]
        => 去尾增頭改標籤 -- 把尾部的div位置換到頭部；並將img標籤改為頭部，再將原先的頭部img標籤改為身體
需要添加的方法：
    1.創建一截蛇身：
        問題1：被創建的那截蛇身要放在什麼位置？
            => 當還沒有蛇，需要創建蛇的時候會調用此方法
            => 當蛇吃到食物時，也需要調用此方法
            => 兩種情況
                1. 沒有蛇頭
                2. 有蛇頭
            => 沒有頭：應該把這一截放在(0,0)
            => 有頭：應該根據方向來決定 這一截 放在哪邊
                -> 即將往右：left += 20; top 不動
                -> 即將往左：left -= 20; top 不動
                -> 即將往下：top += 20; left 不動
                -> 即將往上：top -= 20; left 不動
        問題2：如何判斷原先是否有頭了？
            => 判斷 this.snake 陣列中的第[0]位有沒有數據
    2.創建初始化的蛇
        => 預設初始化的蛇應該佔有五格，就使用for循環調用五次 創建一截蛇身 的方法即可
    3.讓蛇移動一步
        => 把陣列的最後一個數據刪除，map裡的那一個也刪除，再進行一次 創建一截蛇身
    4.判定是否吃到食物
        => 需要食物跟頭的座標，如果食物跟頭座標重合，返回 true；如果沒有重合，返回 false
    5.判定蛇是否死亡(預設如果撞牆就死亡)

*/

//一進入網頁判斷積分紀錄
if (localStorage.getItem('record')) {
    document.querySelector('.high').innerHTML = localStorage.getItem('record')
}


class Snake {
    constructor(ele) {
        this.map = document.querySelector(ele)
        //初始方向設置
        this.direction = 'right'

        //蛇的數據類型
        this.snake = []

        //創建初始化的蛇
        this.creSnake()
    }

    //創建一截蛇身
    creOne() {
        //1. 決定新的一截應該出現的位置
        let head = this.snake[0]

        //假設一個變量為目前的位置
        let pos = {
            left: 0,
            top: 0
        }

        if (head) {
            //如果頭是存在的，就修改一下 pos 內 left 和 top 的值
            //根據目前頭的 位置 和 方向 去修改 left 和 top
            switch (this.direction) {
                case 'right':
                    pos.left = head.offsetLeft + 20
                    pos.top = head.offsetTop + 0
                    break
                case 'left':
                    pos.left = head.offsetLeft - 20
                    pos.top = head.offsetTop + 0
                    break
                case 'bottom':
                    pos.left = head.offsetLeft + 0
                    pos.top = head.offsetTop + 20
                    break
                case 'top':
                    pos.left = head.offsetLeft + 0
                    pos.top = head.offsetTop - 20
                    break
            }
        }

        //2.創建一個新的頭，放在map內
        let creatHead = document.createElement('div')
        creatHead.className = 'head'
        this.map.appendChild(creatHead)
        //2-1.把位置數據也賦值給頭
        creatHead.style.left = pos.left + 'px'
        creatHead.style.top = pos.top + 'px'
        //2-2.把頭塞入蛇陣列最前面的位置
        this.snake.unshift(creatHead)


        //3. 把原先的 head 修改為身體(這時候 head 的位置已經是 this.snake[1])：把類名替換成 body，並加入判斷如果有頭，才進行替換
        if (head) head.className = 'body'

    }

    //創建一條初始化的蛇
    creSnake() {
        //如何創建一條蛇？需要重複調用創建一截蛇身的方法(預設初始化的蛇頭+身總共佔五格)
        for (let i = 0; i < 5; i++)this.creOne()
    }

    //讓蛇移動一步
    move() {
        //如何移動一步？刪除最後一個身體，再添加一個新的頭
        let del = this.snake.pop()  //刪除陣列最後一個的語法返回值是被刪除的那個
        del.remove()
        this.creOne()
    }

    //判定是否吃到食物
    eaten(foodX, foodY) {
        //需要食物跟頭的座標
        let head = this.snake[0]
        let x = head.offsetLeft
        let y = head.offsetTop

        //加個判斷：如果吃到食物，返回 true；如果沒吃到食物，返回 false
        if (x === foodX && y === foodY) {
            return true
        } else {
            return false
        }
    }


    //判定蛇是否死亡
    die() {
        //需要頭的座標
        let head = this.snake[0]
        let x = head.offsetLeft
        let y = head.offsetTop
        let isfail = false

        //判斷頭身有沒有重疊
        for (let i = 1; i < this.snake.length; i++) {
            if (x === this.snake[i].offsetLeft && y === this.snake[i].offsetTop) {
                isfail = true
                break
            }
        }

        //判斷：如果撞到牆壁，返回 true；如果沒撞到牆壁，返回 false
        if (!isfail) {
            if (x < 0 || y < 0 || x >= this.map.clientWidth || y >= this.map.clientHeight) {
                isfail = true
            } else {
                isfail = false
            }
        }
        return isfail
    }

    getBody() {
        let o = {
            x: [],
            y: []
        }
        for (let i = 0; i < this.snake.length; i++) {
            o.x.push(this.snake[i].offsetLeft)
            o.y.push(this.snake[i].offsetTop)
        }
        return o
    }

}


//遊戲規則的 類

/* 

*/

class Game {
    constructor(ele) {
        this.map = document.querySelector(ele)

        //食物
        this.food = new Food(ele)
        //蛇
        this.snake = new Snake(ele)

        //遊戲級別
        this.level = 1
        this.le = document.querySelector('.level')

        //定時器返回值
        this.timer = 0

        //遊戲積分
        this.score = 0
        this.now = document.querySelector('.now')
        this.high = document.querySelector('.high')
    }

    //遊戲開始
    start() {
        //遊戲一開始就先把點擊的事件監聽器移除
        startBtn.removeEventListener('click', go)

        this.timer = setInterval(() => {
            //移動一步
            this.snake.move()
            //判斷積分需不需要更新
            this.highScore()

            //需要判斷是否死亡
            if (this.snake.die()) {
                clearInterval(this.timer)
                alert('game over')
            }


            //需要判斷是否吃到食物了
            if (this.snake.eaten(this.food.x, this.food.y)) {
                //吃到食物那一刻蛇的位置
                let po = this.snake.getBody()
                //食物換個位置
                this.food.changePos(po)
                //加一截
                this.snake.creOne()

                //調整積分
                this.changeScore()

            }
        }, 300 - this.level * 30)


    }

    //遊戲暫停
    pause() {
        clearInterval(this.timer)
        startBtn.addEventListener('click', go)
    }

    //遊戲重新開始
    restart() {
        //重整頁面
        window.location.reload()
    }

    //改變方向
    change(type) {
        switch (type) {
            case 'right': this.snake.direction = 'right'; break
            case 'left': this.snake.direction = 'left'; break
            case 'top': this.snake.direction = 'top'; break
            case 'bottom': this.snake.direction = 'bottom'; break
        }
    }

    //積分調整
    changeScore() {
        this.score += 100
        this.now.innerText = this.score

        //調整級別
        if (this.score > 0 && this.score % 500 === 0) {
            this.level++
            this.le.innerText = this.level

            //讓遊戲暫停一下再開始
            this.pause()
            this.highScore()
            let con = confirm('恭喜晉級！')
            if (con) {
                this.start()
            } else {
                //按取消的話就重新開始
                this.restart()
            }
        }
    }

    //積分紀錄更新
    highScore() {
        if (!(localStorage.getItem('record')) || (localStorage.getItem('record') - 0) < this.score) {
            localStorage.setItem('record', this.score)
            this.high.innerHTML = localStorage.getItem('record')
        }
    }


}


var g1 = new Game('.map')



startBtn.addEventListener('click', go)
function go() {
    g1.start()
}
pauseBtn.addEventListener('click', () => {
    g1.pause()
})
restartBtn.addEventListener('click', () => {
    g1.restart()
})

document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 32: g1.start(); break
        case 13: g1.pause(); break
        case 37: g1.change('left'); break
        case 38: g1.change('top'); break
        case 39: g1.change('right'); break
        case 40: g1.change('bottom'); break
    }
})
