class AggressivityTracker extends Entity {
    constructor() {
        super();
        this.categories.push('aggressivity-tracker');
        this.maxAggression = 3;
        this.currentAggression = 0;
        this.aggressive = new Set();
    }

    get z() { 
        return LAYER_PATH + 1;
    }

    requestAggression(enemy) {
        this.cancelAggression(enemy);

        const { aggression } = enemy;
        if (this.currentAggression + aggression > this.maxAggression) {
            return;
        }

        this.currentAggression += aggression;
        this.aggressive.add(enemy);
        return true
    }

    cancelAggression(enemy) {
        if (this.aggressive.has(enemy)) {
            const { aggression } = enemy;
            this.currentAggression -= aggression;
            this.aggressive.delete(enemy);
        }
    }

    doRender(camera) {
        if (DEBUG) {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.textAlign = nomangle('center');
            ctx.textBaseline = nomangle('middle');
            ctx.font = nomangle('12pt Courier');

            ctx.wrap(() => {
                ctx.translate(camera.x, camera.y - 100);
        
                ctx.strokeText('Agg: ' + this.currentAggression, 0, 0);
                ctx.fillText('Agg: ' + this.currentAggression, 0, 0);
            });

            const player = firstItem(this.scene.category('player'));
            if (!player) return;

            for (const enemy of this.aggressive) {
                ctx.strokeStyle = '#f00';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(enemy.x, enemy.y);
                ctx.lineTo(player.x, player.y);
                ctx.stroke();
            }
        }
    }
}